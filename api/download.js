export default async function handler(req, res) {
    const { os } = req.query; // Expect ?os=mac, ?os=win, or ?os=linux

    // Make sure we have the token in the environment
    const token = process.env.GH_TOKEN;
    if (!token) {
        return res.status(500).json({ error: "Server missing GH_TOKEN environment variable" });
    }

    try {
        // 1. Get the latest release from the private repo
        const releaseResponse = await fetch("https://api.github.com/repos/TipTop-Tech/Cognitext/releases/latest", {
            headers: {
                "Authorization": `token ${token}`,
                "User-Agent": "Cognitext-Download-Portal"
            }
        });

        if (!releaseResponse.ok) {
            return res.status(releaseResponse.status).json({ error: "Failed to fetch release info" });
        }

        const releaseData = await releaseResponse.json();

        // 2. Find the correct asset for the requested OS
        let targetExtension = "";
        if (os === "mac") {
            targetExtension = ".dmg";
            // Note: If you want to prefer apple silicon natively, you might check for "-arm64.dmg".
            // Let's default to standard .dmg (Intel/Rosetta) or let them choose.
        } else if (os === "win") {
            targetExtension = ".exe";
        } else if (os === "linux") {
            targetExtension = ".AppImage";
        } else {
            return res.status(400).json({ error: "Invalid OS parameter. Use ?os=mac, win, or linux" });
        }

        const asset = releaseData.assets.find(a => a.name.endsWith(targetExtension));

        if (!asset) {
            return res.status(404).json({ error: `No release asset found for OS: ${os}` });
        }

        // 3. Request the actual download redirect from GitHub 
        // Usually, hitting the raw url gives a 302 redirect to Amazon S3
        const downloadResponse = await fetch(asset.url, {
            method: "GET",
            // Important: We request the raw binary stream, which triggers the redirect
            headers: {
                "Authorization": `token ${token}`,
                "Accept": "application/octet-stream",
                "User-Agent": "Cognitext-Download-Portal"
            },
            redirect: "manual" // We want to catch the redirect URL ourselves
        });

        // 4. GitHub responds with a 302 Found and a 'location' header pointing to AWS
        if (downloadResponse.status === 302 || downloadResponse.status === 301) {
            const s3Url = downloadResponse.headers.get("location");

            // Redirect the user's browser directly to the S3 bucket download link!
            res.redirect(302, s3Url);
        } else {
            // Sometimes it returns the stream directly depending on API changes
            return res.status(500).json({ error: "Expected redirect from GitHub, got something else." });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
