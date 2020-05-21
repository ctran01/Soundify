document.addEventListener('DOMContentLoaded', e => {

    const cancelPlaylist = document.querySelector('.createPlaylist-button-cancel')
    const createPlaylist = document.querySelector('.createPlaylist-button-create')

    createPlaylist.addEventListener("click", async (e) => {
        e.preventDefault();
        console.log('button was clicked')
        const form = document.querySelector('.create-playlist-form');
        const formData = new FormData(form);
        const name = formData.get("name");
        const createdBy = localStorage.getItem('SOUNDIFY_CURRENT_USER_ID')
        const body = { name, createdBy };

        try {
            const res = await fetch("http://localhost:8080/playlist",
                {
                    method: "POST",
                    body: JSON.stringify(body),
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("SOUNDIFY_ACCESS_TOKEN")}`
                    }
                })
            if (!res.ok) {
                throw res
            }

            try {
                const res = await fetch(`http://localhost:8080/user/${createdBy}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${localStorage.getItem("SOUNDIFY_ACCESS_TOKEN")}`
                        }
                    })
                if (!res.ok) {
                    throw res
                }

                const { playlists } = await res.json()
                const playlistContainer = document.querySelector('.left-nav__playlists-container')
                const { name, id } = playlists[playlists.length - 1]
                const playlistHTML = `
                <div class='left-nav__playlist-link-container'>
                    <button class='left-nav__playlist-link' id='playlist-link-${id}'>
                        ${name}
                    </button>
                </div >
                `
                playlistContainer.innerHTML += playlistHTML
            } catch (e) {
                console.error(e)
            }

            document.querySelector('.createPlaylistScreen')
                .classList.add('createPlaylistScreen--hidden')
            document.querySelector('.left-nav__createPlaylist-input')
                .value = ''
        } catch (err) {
            //Create HTML rendered errors
            console.error(err)
        }
    })

    cancelPlaylist.addEventListener('click', e => {
        e.preventDefault();
        document.querySelector('.createPlaylistScreen')
            .classList.add('createPlaylistScreen--hidden')
        document.querySelector('.left-nav__createPlaylist-input')
            .value = ''
    })


})
