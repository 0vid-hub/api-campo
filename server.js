const express = require('express');
const { createCanvas, loadImage } = require('canvas');
const app = express();

app.get('/gerar-campo', async (req, res) => {
    try {
        const campo = await loadImage('https://i.ibb.co/QFHkJ1qP/time.png');
        const canvas = createCanvas(campo.width, campo.height);
        const ctx = canvas.getContext('2d');

        ctx.drawImage(campo, 0, 0);

        const posicoes = {
            gr:  { x: 350, y: 800 },
            ld:  { x: 620, y: 620 },
            dc1: { x: 440, y: 650 },
            dc2: { x: 260, y: 650 },
            le:  { x: 80,  y: 620 },
            mc:  { x: 350, y: 480 },
            mo1: { x: 500, y: 380 },
            mo2: { x: 200, y: 380 },
            ee:  { x: 80,  y: 200 },
            ed:  { x: 620, y: 200 },
            pl:  { x: 350, y: 150 }
        };

        const larguraCarta = 90;
        const alturaCarta = 130;

        for (const [pos, coords] of Object.entries(posicoes)) {
            const imgUrl = req.query[pos];
            if (imgUrl && imgUrl !== 'ninguém' && imgUrl !== '') {
                try {
                    const cartaImg = await loadImage(imgUrl);
                    ctx.drawImage(cartaImg, coords.x, coords.y, larguraCarta, alturaCarta);
                } catch (err) {}
            }
        }

        res.setHeader('Content-Type', 'image/png');
        canvas.createPNGStream().pipe(res);
    } catch (e) {
        res.status(500).send("Erro ao gerar imagem.");
    }
});

app.listen(process.env.PORT || 3000);
