const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function runCommand(command) {
    try {
        console.log(`Executing: ${command}`);
        execSync(command, { stdio: 'inherit' });
        return true;
    } catch (error) {
        console.error(`Command failed: ${command}\n`, error.message);
        return false;
    }
}

// Simple delay helper to give the operating system time to release file handles
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function runPipeline() {
    const packageJsonPath = path.join(__dirname, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
        console.error('Error: package.json not found in this directory.');
        process.exit(1);
    }

    // 1. Parse manifest details
    const packageData = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const extensionName = packageData.name;
    const publisher = packageData.publisher || 'local';
    const currentVersion = packageData.version || '0.0.0';
    const extensionId = `${publisher}.${extensionName}`;
    
    console.log(`Target Extension ID: ${extensionId}`);

    // 2. Step 1: Uninstall the existing active build out of Cursor
    console.log('\n--- 1/4: Uninstalling Old Version ---');
    runCommand(`cursor --uninstall-extension ${extensionId} --force`);

    // Wait 250ms for the file system to completely drop file-locks on the old extension cache
    console.log('Waiting for file handles to clear...');
    await delay(250);

    // 3. Step 2: Increment the last digit of the version string
    console.log('\n--- 2/4: Incrementing Build Version ---');
    let versionParts = currentVersion.split('.');
    if (versionParts.length === 3) {
        versionParts[2] = String(parseInt(versionParts[2], 10) + 1);
        packageData.version = versionParts.join('.');
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageData, null, 2) + '\n', 'utf8');
        console.log(`Version successfully bumped: ${currentVersion} -> ${packageData.version}`);
    } else {
        console.error(`Malformed version format string: ${currentVersion}. Aborting build.`);
        process.exit(1);
    }

    // 4. Step 3: Package the extension into a local .vsix archive container
    console.log('\n--- 3/4: Packaging Extension (.vsix) ---');
    
    // Clear out any old stale .vsix files from previous runs to avoid false matches
    fs.readdirSync(__dirname).forEach(file => {
        if (file.endsWith('.vsix')) {
            try { fs.unlinkSync(path.join(__dirname, file)); } catch (e) {}
        }
    });

    //const packageSuccess = runCommand('vsce package --allow-unused-files-pattern');
    //const packageSuccess = runCommand('vsce package --no-dependencies');
    const packageSuccess = runCommand('vsce package');

    if (!packageSuccess) {
        console.error('Packaging failed. Aborting pipeline installer.');
        process.exit(1);
    }

    // Dynamic Look-up: Scan the folder and grab whatever name vsce used for the archive
    const generatedVsixFile = fs.readdirSync(__dirname).find(file => file.endsWith('.vsix'));
    if (!generatedVsixFile) {
        console.error('Could not locate any generated .vsix archive payload in the workspace.');
        process.exit(1);
    }
    
    const vsixFilePath = path.join(__dirname, generatedVsixFile);
    console.log(`Located archive payload: ${generatedVsixFile}`);

    // 5. Step 4: Install the brand new version straight into Cursor
    console.log('\n--- 4/4: Installing New Build Into Cursor ---');
    const installSuccess = runCommand(`cursor --install-extension "${vsixFilePath}" --force`);
    
    if (installSuccess) {
        console.log('\n=== Success! Extension deployed seamlessly. Restart Cursor to apply modifications. ===');
        
        // Clean up the temporary local file to keep your git repo pristine
        try {
            fs.unlinkSync(vsixFilePath);
            console.log('Cleaned up temporary workspace build files.');
        } catch (e) {}
    } else {
        console.error('\nInstallation pipeline failed.');
        process.exit(1);
    }
}

// Execute the async pipeline
runPipeline();
