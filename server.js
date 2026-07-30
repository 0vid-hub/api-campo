const express = require('express');
const { createCanvas, loadImage } = require('@napi-rs/canvas');
const app = express();

app.get('/gerar-campo', async (req, res) => {
    try {
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

        // Posições ajustadas de cima para baixo
        const posicoes = {
            // ATAQUE
            ee:  { x: 80,  y: 100 },
            pl:  { x: 305, y: 80  },
            ed:  { x: 530, y: 100 },

            // MEIO-CAMPO
            mo1: { x: 170, y: 300 },
            mo2: { x: 440, y: 300 },
            mc:  { x: 305, y: 460 },

            // DEFESA
            le:  { x: 60,  y: 650 },
            dc1: { x: 210, y: 680 },
            dc2: { x: 400, y: 680 },
            ld:  { x: 550, y: 650 },

            // GOLEIRO
            gr:  { x: 305, y: 880 }
        };

        const larguraCarta = 90;
        const alturaCarta = 130;

        for (const [pos, coords] of Object.entries(posicoes)) {
            // Caixa cinza para marcar o espaço da carta
            ctx.strokeStyle = '#666666';
            ctx.lineWidth = 2;
            ctx.strokeRect(coords.x, coords.y, larguraCarta, alturaCarta);

            // Nome da posição no topo da caixa
            ctx.fillStyle = '#000000';
            ctx.font = 'bold 16px sans-serif';
            ctx.fillText(pos.toUpperCase(), coords.x + 8, coords.y + 22);

            const valorParam = req.query[pos];

            if (valorParam && valorParam !== 'ninguém' && valorParam !== 'Ninguém' && valorParam !== '') {
                // Se for um link de imagem (começa com http), desenha a imagem da carta
                if (valorParam.startsWith('http://') || valorParam.startsWith('https://')) {
                    try {
                        const cartaImg = await loadImage(valorParam);
                        ctx.drawImage(cartaImg, coords.x, coords.y, larguraCarta, alturaCarta);
                    } catch (err) {
                        console.error(`Erro ao carregar imagem para ${pos}:`, err.message);
                    }
                } else {
                    // Se for apenas o nome do jogador (texto), desenha o nome na caixa
                    ctx.fillStyle = '#333333';
                    ctx.font = '12px sans-serif';
                    ctx.fillText(valorParam.substring(0, 10), coords.x + 5, coords.y + 70);
                }
            }
        }

        const buffer = await canvas.toBuffer('image/png');
        res.setHeader('Content-Type', 'image/png');
        res.send(buffer);

    } catch (e) {
        console.error(e);
        res.status(500).send("Erro ao gerar imagem.");
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Servidor ativo!");
});
