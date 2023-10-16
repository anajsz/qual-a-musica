let player;
let trackName;
let pontos = 0;
let erros = 0;

function atualizarPontuacao() {
    const pontuacaoElement = document.getElementById("score");
    pontuacaoElement.innerText = `Pontuação: ${pontos}`;
}

function reiniciarJogo() {
    alert("Você errou 3 vezes e perdeu o jogo!");
    window.location.href = "index.html"; // Redireciona para a página de entrada
}

window.onSpotifyWebPlaybackSDKReady = () => {
    // Substitua o token abaixo a cada hora, precisa estar logado, através do link https://developer.spotify.com/documentation/web-playback-sdk/tutorials/getting-started
    const token = "BQBdAniyjUY0By05bSjxzFrVh8MpDozb-OCe-dKzL_kyA3pZhaqULU6V5amhH6dfKOq8bvw5DvJ40aK5tcsPF7z1cvzTf1zRg8r3ppA2dkX851hUWOs-8eEcjt1dwZmHouNkpcHe1C09oemZ_x1IZnwEPzt4V292f6vFLh6bw7YsiP81ZU5xDRDx-oJ9yVCCkduQ-TnW9qrZONByXXSuaOWAhbXw";
    player = new Spotify.Player({
        name: "Web Playback SDK Quick Start Player",
        getOAuthToken: (cb) => {
            cb(token);
        },
        volume: 0.5,
    });

    player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        const connect_to_device = () => {
            let album_uri = "spotify:album:18HaPkTt6Ez7yKgjJ3wRht";
            fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
                method: "PUT",
                body: JSON.stringify({
                    context_uri: album_uri,
                    play: false,
                }),
                headers: new Headers({
                    "Authorization": "Bearer " + token,
                }),
            }).then(response => console.log(response))
            .then(data => {
                player.addListener('player_state_changed', ({
                    track_window
                }) => {
                    trackName = track_window.current_track.name;
                    trackName = trackName.toLowerCase();
                    console.log('Current Track:', trackName);
                });
            });
        }
        connect_to_device();
    });

    document.getElementById("play-music").addEventListener('click', () => {
        player.togglePlay();
        setTimeout(() => {
            player.pause();
        }, 13000);
    });

    document.getElementById("btn-resposta").addEventListener('click', (event) => {
        event.preventDefault();
        let resposta = document.getElementById("resposta").value;
        resposta = resposta.toLowerCase();
        if (resposta == trackName) {
            alert("Você Acertou, Parabéns!");
            pontos += 10;
            atualizarPontuacao();
            document.getElementById("resposta").value = "";
            player.nextTrack();
            setTimeout(() => {
                player.pause();
            }, 1300);
        } else {
            alert("Você errou, tente novamente!");
            erros++;
            if (erros === 3) {
                reiniciarJogo();
            }
        }
    });
    player.connect();
};