import random

# Pools of high-quality Unsplash image URLs for premium visual design
ARTIST_PHOTOS = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop", # Woman singing/portrait
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop", # Man portrait
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop", # Woman portrait
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop", # Man portrait 2
    "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=300&auto=format&fit=crop", # Young man portrait
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop", # Woman portrait 3
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=300&auto=format&fit=crop", # Man portrait 3
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=300&auto=format&fit=crop", # Woman smiling
    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=300&auto=format&fit=crop", # Man style
    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=300&auto=format&fit=crop", # Man suit
    "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?q=80&w=300&auto=format&fit=crop", # Woman portrait 4
    "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?q=80&w=300&auto=format&fit=crop", # Man profile
    "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=300&auto=format&fit=crop", # Woman portrait 5
    "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=300&auto=format&fit=crop", # Woman portrait 6
    "https://images.unsplash.com/photo-1504257404764-5a965993e285?q=80&w=300&auto=format&fit=crop"  # Man retro
]

COVER_PHOTOS = [
    "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=300&auto=format&fit=crop", # Neon purple swirl
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=300&auto=format&fit=crop", # Stage lights
    "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=300&auto=format&fit=crop", # Abstract paint splash
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=300&auto=format&fit=crop", # DJ mixer
    "https://images.unsplash.com/photo-1487180142328-0c4e37023af5?q=80&w=300&auto=format&fit=crop", # Vinyl record player
    "https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=300&auto=format&fit=crop", # Classical violin
    "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=300&auto=format&fit=crop", # Rock concert hands
    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=300&auto=format&fit=crop", # Retro microphone
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=300&auto=format&fit=crop", # Headphones on table
    "https://images.unsplash.com/photo-1446057032654-9d8885b7518a?q=80&w=300&auto=format&fit=crop", # Guitar silhouette
    "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=300&auto=format&fit=crop", # Abstract lights
    "https://images.unsplash.com/photo-1526218626217-dc65a29bb444?q=80&w=300&auto=format&fit=crop", # Singer in blue light
    "https://images.unsplash.com/photo-1453090923802-60c3d5942630?q=80&w=300&auto=format&fit=crop", # Retro stereo speakers
    "https://images.unsplash.com/photo-1516280440614-37939bbacd6a?q=80&w=300&auto=format&fit=crop", # Concert smoke and lasers
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=300&auto=format&fit=crop"  # Sunset silhouette band
]

PODCAST_PHOTOS = [
    "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=300&auto=format&fit=crop", # Mic close up
    "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=300&auto=format&fit=crop", # Podcast table
    "https://images.unsplash.com/photo-1589903308904-1010c2294adc?q=80&w=300&auto=format&fit=crop", # Recording setup
    "https://images.unsplash.com/photo-1618609378039-b572f64c5b42?q=80&w=300&auto=format&fit=crop", # Sound waves
    "https://images.unsplash.com/photo-1593642532842-98d0fd5ebc1a?q=80&w=300&auto=format&fit=crop"  # Cozy study space
]

# Supported artist details
ARTIST_DATA = [
    {"name": "Marconi Union", "bio": "Ambient pioneers famous for creating highly calming soundscapes backed by sound therapy science."},
    {"name": "Coldplay", "bio": "British rock band formed in London in 1996, one of the most successful acts of the 21st century."},
    {"name": "Jack Johnson", "bio": "American singer-songwriter and former professional surfer known for soft rock and acoustic pop."},
    {"name": "Yiruma", "bio": "South Korean pianist and composer known globally for his expressive and emotive classical-pop instrumentals."},
    {"name": "Adele", "bio": "English singer-songwriter known for her powerful vocals, heartfelt lyrics, and massive global success."},
    {"name": "Aria Vale", "bio": "Synthwave producer weaving nostalgic 80s neon soundtracks and retro-futuristic soundscapes."},
    {"name": "Signal Bloom", "bio": "Deep house and electronic project blending driving beats with emotional melodic synth lines."},
    {"name": "Solace Lane", "bio": "Lo-fi and ambient guitar artist crafting quiet bedroom vibes for relaxed study sessions."},
    {"name": "Kairo Jet", "bio": "Chillhop beatmaker blending jazzy chord progressions with dusty boom-bap rhythm sections."},
    {"name": "Nova Drift", "bio": "Indie pop outfit crafting sun-drenched guitar loops and upbeat driving rhythms."},
    {"name": "Celeste Minor", "bio": "Dreamy space ambient composer designing vast, floating soundtracks for starry nights."},
    {"name": "Lux Fader", "bio": "Jazz fusion producer blending classic electric keyboard progressions with modern breakbeats."},
    {"name": "Solstice Keys", "bio": "Neoclassical composer whose minimalist piano pieces provide comforting focus atmospheres."}
]

# Additional names to make up 55+ total artists
ADDITIONAL_ARTIST_NAMES = [
    "Echo Pulse", "Luna Eclipse", "Stellar Tide", "Neon Horizon", "Vibe Architect",
    "Prism Ray", "Dusk Runner", "Satin Waves", "Golden Haze", "Quiet Storm",
    "Digital Bloom", "Acoustic Drift", "Beat Whisperer", "Urban Lo-Fi", "Synth Symphony",
    "Velvet Tone", "Canyon Echo", "Ocean Breeze", "Timber & Twine", "Northern Light",
    "Mellow Glow", "Midnight Muse", "Copper String", "Restless Wind", "Wandering Soul",
    "Infinite Loop", "Static Cloud", "Hologram Sky", "Subtle Groove", "Driftwood",
    "Frequency Shift", "Astral Flight", "Saffron Moon", "Fable & Song", "Deep River",
    "Solar Flair", "Coastal Drive", "Haze & Thunder", "Vivid Dream", "Chamber Keys",
    "Sage Sound", "Wildflower", "Indigo Sky", "Ghost Beat"
]

ALBUM_NAMES = [
    "Nocturne Systems", "Room Tone", "Flow State", "Skyline", "Late Session", "Daybreak",
    "Neon Dreams", "Echo Chamber", "Subterranean", "Aura", "Lost in Time", "Future Nostalgia",
    "Ethereal", "Holographic", "Unspoken", "Prism", "Drift", "Static Waves", "Resonance", "Solitude"
]

GENRES = ["Electronic", "Synthwave", "Dance", "Ambient", "Lo-Fi", "Chillhop", "Indie Pop", "Jazz Fusion", "Piano", "Acoustic"]

MOODS = ["happy", "sad", "romantic", "angry", "relaxed", "calm", "focus", "study", "workout", "party", "sleep", "travel", "stress", "motivation"]

def generate_catalog():
    # 1. Generate 55+ Artists
    artists = []
    all_artist_names = []
    
    # Add structured artists first
    for i, data in enumerate(ARTIST_DATA):
        name = data["name"]
        all_artist_names.append(name)
        artists.append({
            "artist_id": f"art-{i+1}",
            "name": name,
            "profile_pic": ARTIST_PHOTOS[i % len(ARTIST_PHOTOS)],
            "bio": data["bio"],
            "monthly_listeners": (15000000 - (i * 900000)) + random.randint(1000, 50000),
            "similar_artists": []
        })
        
    # Fill in rest of 55+ artists
    start_idx = len(artists)
    for j, name in enumerate(ADDITIONAL_ARTIST_NAMES):
        all_artist_names.append(name)
        idx = start_idx + j
        artists.append({
            "artist_id": f"art-{idx+1}",
            "name": name,
            "profile_pic": ARTIST_PHOTOS[idx % len(ARTIST_PHOTOS)],
            "bio": f"Alternative music project from {name}, blending indie roots with modern sonic textures.",
            "monthly_listeners": (2500000 - (j * 50000)) + random.randint(-2000, 2000),
            "similar_artists": []
        })
        
    # Populate similar artists
    for artist in artists:
        similars = [a["name"] for a in artists if a["name"] != artist["name"]]
        # Seed pseudo-randomly based on name hash for stability
        random_gen = random.Random(artist["name"])
        artist["similar_artists"] = random_gen.sample(similars, 4)

    # 2. Generate 100 Tracks (Songs)
    tracks = []
    
    # Specific User requested tracks for the 'stress' mood
    requested_stress_tracks = [
        {"title": "Weightless", "artist": "Marconi Union", "album": "Ambient Transmissions", "genre": "Ambient", "duration": 480, "popularity": 0.98, "release_year": 2011},
        {"title": "Fix You", "artist": "Coldplay", "album": "X&Y", "genre": "Rock", "duration": 295, "popularity": 0.99, "release_year": 2005},
        {"title": "Better Together", "artist": "Jack Johnson", "album": "In Between Dreams", "genre": "Acoustic", "duration": 207, "popularity": 0.96, "release_year": 2005},
        {"title": "River Flows in You", "artist": "Yiruma", "album": "First Love", "genre": "Piano", "duration": 188, "popularity": 0.97, "release_year": 2001},
        {"title": "Someone Like You", "artist": "Adele", "album": "21", "genre": "Pop", "duration": 285, "popularity": 0.99, "release_year": 2011}
    ]
    
    for i, spec in enumerate(requested_stress_tracks):
        tracks.append({
            "track_id": f"rf-spec-{i+1}",
            "title": spec["title"],
            "artist": spec["artist"],
            "album": spec["album"],
            "genres": [spec["genre"]],
            "mood": "stress",
            "duration": spec["duration"],
            "audio_url": f"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-{i+1}.mp3",
            "cover_image": COVER_PHOTOS[i % len(COVER_PHOTOS)],
            "popularity": spec["popularity"],
            "type": "song",
            "release_year": spec["release_year"]
        })
        
    # Programmatically generate remaining 95 songs to make up 100 total
    total_tracks_needed = 100
    generated_count = total_tracks_needed - len(tracks)
    
    for k in range(generated_count):
        idx = len(tracks)
        
        # Pick artist and album stably based on index
        artist = all_artist_names[idx % len(all_artist_names)]
        album = ALBUM_NAMES[idx % len(ALBUM_NAMES)]
        genre = GENRES[idx % len(GENRES)]
        mood = MOODS[idx % len(MOODS)]
        
        # Adjust values slightly for variety
        duration = 180 + ((idx * 7) % 240)
        popularity = round(0.50 + ((idx * 0.005) % 0.48), 2)
        release_year = 2018 + (idx % 9)
        sound_helix_num = (idx % 16) + 1
        
        tracks.append({
            "track_id": f"rf-gen-{idx+1}",
            "title": f"Chasing {album.split()[0]} {idx+1}",
            "artist": artist,
            "album": album,
            "genres": [genre],
            "mood": mood,
            "duration": duration,
            "audio_url": f"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-{sound_helix_num}.mp3",
            "cover_image": COVER_PHOTOS[idx % len(COVER_PHOTOS)],
            "popularity": popularity,
            "type": "song",
            "release_year": release_year
        })
        
    # 3. Generate 20 Podcast Episodes across 5 different podcast shows
    podcasts = []
    podcast_categories = ["Science", "Business", "Psychology", "Technology", "Arts"]
    podcast_titles = [
        {"title": "The Power of Habit", "host": "TED Radio Hour", "description": "Behavior change, creativity, and how routines shape human performance.", "cat": "Science"},
        {"title": "How Music Affects Your Brain", "host": "BrainStuff", "description": "The neuroscience of rhythm, memory, and emotional regulation.", "cat": "Science"},
        {"title": "Creativity and Flow", "host": "The Psychology Podcast", "description": "How artists, writers, and engineers build repeatable focus rituals.", "cat": "Psychology"},
        {"title": "Tech Talk Weekly", "host": "Tech Disruptors", "description": "Deep-dives into future tech, developer tools, and AI architectures.", "cat": "Technology"},
        {"title": "The Art of Business", "host": "HBR IdeaCast", "description": "Unveiling leadership habits, marketing tactics, and scaling strategies.", "cat": "Business"}
    ]
    
    for p_idx, pod in enumerate(podcast_titles):
        p_id = f"pod-{p_idx+1}"
        episodes = []
        
        # 4 episodes per podcast to get exactly 20 podcast episodes total
        for ep_idx in range(4):
            ep_id = f"{p_id}-ep-{ep_idx+1}"
            sound_helix_num = 1 + ((p_idx * 4 + ep_idx) % 16)
            episodes.append({
                "episode_id": ep_id,
                "title": f"Episode {ep_idx+1}: {pod['title']} Deepdive",
                "description": f"Exploring fundamental concepts and interviewing leading industry researchers regarding {pod['title'].lower()}.",
                "duration": 1500 + (ep_idx * 120),
                "audio_url": f"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-{sound_helix_num}.mp3",
                "cover_image": PODCAST_PHOTOS[p_idx % len(PODCAST_PHOTOS)],
                "release_date": f"2026-07-{(p_idx*5 + ep_idx + 1):02d}"
            })
            
        podcasts.append({
            "podcast_id": p_id,
            "title": pod["title"],
            "host": pod["host"],
            "description": pod["description"],
            "cover_image": PODCAST_PHOTOS[p_idx % len(PODCAST_PHOTOS)],
            "category": pod["cat"],
            "episodes": episodes
        })
        
    # 4. Generate Curated Playlists containing tracks
    playlists = [
        {
            "playlist_id": "pl-chill",
            "name": "Late Night Drift",
            "owner_id": "system",
            "is_public": True,
            "tracks": ["rf-spec-1", "rf-spec-3", "rf-gen-12", "rf-gen-24"],
            "description": "Low-light tracks for deep focus and late-night listening."
        },
        {
            "playlist_id": "pl-energy",
            "name": "Pulse Boost",
            "owner_id": "system",
            "is_public": True,
            "tracks": ["rf-spec-2", "rf-gen-8", "rf-gen-18", "rf-gen-32"],
            "description": "Uplifting tracks for motion, hype, and momentum."
        },
        {
            "playlist_id": "pl-stress",
            "name": "Stress Relief Lounge",
            "owner_id": "system",
            "is_public": True,
            "tracks": ["rf-spec-1", "rf-spec-2", "rf-spec-3", "rf-spec-4", "rf-spec-5"],
            "description": "Curated tracks to melt anxiety away and relax your mind."
        },
        {
            "playlist_id": "pl-focus",
            "name": "Focus Flow State",
            "owner_id": "system",
            "is_public": True,
            "tracks": ["rf-gen-6", "rf-gen-16", "rf-gen-26", "rf-gen-36", "rf-gen-46"],
            "description": "Minimal instrumentals for developers, students, and writers."
        }
    ]
    
    return artists, tracks, podcasts, playlists

DEFAULT_ARTISTS, DEFAULT_TRACKS, DEFAULT_PODCASTS, DEFAULT_PLAYLISTS = generate_catalog()
