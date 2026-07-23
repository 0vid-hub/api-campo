const express = require('express');
const { createCanvas, loadImage } = require('canvas');
const app = express();

app.get('/gerar-campo', async (req, res) => {
    try {
        // Criar um fundo branco retangular de 800x1000
        const width = 800;
        const height = 1000;
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        // Preencher o fundo de branco
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);

        // Borda preta em volta para ver os limites
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 5;
        ctx.strokeRect(0, 0, width, height);

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

        // Desenhar retângulos guia e nomes de cada posição
        for (const [pos, coords] of Object.entries(posicoes)) {
            // Desenha caixa tracejada
            ctx.strokeStyle = '#888888';
            ctx.lineWidth = 2;
            ctx.strokeRect(coords.x, coords.y, larguraCarta, alturaCarta);

            // Escreve a sigla da posição
            ctx.fillStyle = '#333333';
            ctx.font = 'bold 16px sans-serif';
            ctx.fillText(pos.toUpperCase(), coords.x + 10, coords.y + 25);

            // Se for passado o link de uma imagem via URL, cola por cima!
            const imgUrl = req.query[pos];
            if (imgUrl && imgUrl !== 'ninguém' && imgUrl !== 'Ninguém' && imgUrl !== '') {
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
