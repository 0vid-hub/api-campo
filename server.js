const express = require('express');
const { createCanvas, loadImage } = require('canvas');
const app = express();

app.get('/gerar-campo', async (req, res) => {
    try {
        // Fundo Vertical Em Pé (700 largura x 1100 altura)
        const width = 700;
        const height = 1100;
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        // Preencher o fundo de branco
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);

        // Borda preta em volta do retângulo
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 6;
        ctx.strokeRect(0, 0, width, height);

        // Posições ajustadas perfeitamente de cima para baixo
        const posicoes = {
            // ATAQUE (Topo)
            ee:  { x: 80,  y: 100 },
            pl:  { x: 305, y: 80  },
            ed:  { x: 530, y: 100 },

            // MEIO-CAMPO (Meio)
            mo1: { x: 170, y: 300 },
            mo2: { x: 440, y: 300 },
            mc:  { x: 305, y: 460 },

            // DEFESA (Baixo)
            le:  { x: 60,  y: 650 },
            dc1: { x: 210, y: 680 },
            dc2: { x: 400, y: 680 },
            ld:  { x: 550, y: 650 },

            // GOLERIO (Fundo)
            gr:  { x: 305, y: 880 }
        };

        const larguraCarta = 90;
        const alturaCarta = 130;

        // Desenhar retângulos guia e nomes de cada posição
        for (const [pos, coords] of Object.entries(posicoes)) {
            // Caixa cinza para marcar o espaço da carta
            ctx.strokeStyle = '#666666';
            ctx.lineWidth = 2;
            ctx.strokeRect(coords.x, coords.y, larguraCarta, alturaCarta);

            // Nome da posição no topo da caixa
            ctx.fillStyle = '#000000';
            ctx.font = 'bold 16px sans-serif';
            ctx.fillText(pos.toUpperCase(), coords.x + 8, coords.y + 22);

            // Desenhar a carta se o link for enviado na URL
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
