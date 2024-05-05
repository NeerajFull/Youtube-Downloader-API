const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/sendplaylistid", async (req, res) => {
    try {
        const { playlistId } = req.body;

        const getData = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?key=AIzaSyDfogNvuNqm1uwdMUI1-G9V0uANsSp4ElA&part=contentDetails&maxResults=50&playlistId=${playlistId}`);
        const data = (await getData.json()).items;

        res.json({ data: data });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to download video' });
    }

})

app.get('/download', (req, res) => {
    const URL = req.query.URL;

    res.header('Content-Disposition', `attachment; filename="video.mp4"`);

    ytdl(URL, {
        format: 'mp4',
        filter: 'audioandvideo',
        quality: "highest"
    })
        .on('error', (err) => {
            console.error('Error downloading video:', err);
            if (err.message.includes('This video is unavailable')) {
                console.log('Skipping private video:', URL);
                // Do nothing to skip this video
            } else {
                res.status(500).json({ error: 'Failed to download video' });
            }
        })
        .pipe(res)
        .on('end', () => {
            res.json({ url: URL });
        });
});



app.listen(4000, () => {
    console.log('Server Works !!! At port 4000');
});