import random

# Pools of high-quality Unsplash image URLs for premium visual design
ARTIST_PHOTOS = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=300&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=300&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=300&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=300&auto=format&fit=crop"
]

COVER_PHOTOS = [
    "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=300&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=300&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=300&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=300&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1487180142328-0c4e37023af5?q=80&w=300&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=300&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=300&auto=format&fit=crop"
]

PODCAST_PHOTOS = [
    "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=300&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?q=80&w=300&auto=format&fit=crop"
]

# Supported artist details
ARTIST_DATA = [
    {"name": "Arijit Singh", "bio": "Renowned Indian playback singer and music composer, one of the most streamed artists in Indian music history."},
    {"name": "A.R. Rahman", "bio": "Academy Award and Grammy-winning Indian composer, producer, and singer known for redefining Indian film music."},
    {"name": "Shreya Ghoshal", "bio": "One of India's most celebrated playback singers, known for her wide vocal range and timeless melodies."},
    {"name": "Pritam", "bio": "Prolific Indian music director and composer responsible for scores of chart-topping Bollywood hits."},
    {"name": "AP Dhillon", "bio": "Indo-Canadian singer, songwriter, and rapper pioneering global Punjabi pop and hip-hop."},
    {"name": "Diljit Dosanjh", "bio": "International Punjabi superstar, singer, and actor bringing Punjabi music to global stadium stages."},
    {"name": "Anuv Jain", "bio": "Popular Indian indie singer-songwriter known for intimate acoustic hits like Baarishein and Jo Tum Mere Ho."},
    {"name": "Ritviz", "bio": "Indian electronic music producer and singer famous for unique fusion of Indian vocal melodies and bass music."},
    {"name": "Prateek Kuhad", "bio": "Critically acclaimed Indian indie folk-pop singer-songwriter praised globally for soulful ballads."},
    {"name": "Atif Aslam", "bio": "Beloved vocal powerhouse famous across South Asia for romantic ballads and Sufi rock anthems."},
    {"name": "Charlie Puth", "bio": "American singer, songwriter, and record producer known for global pop smashes Attention and Voicenotes."},
    {"name": "Badshah", "bio": "Indian rapper and music producer known for party anthems and massive club tracks."},
    {"name": "Divine", "bio": "Trailblazing Indian hip-hop artist from Mumbai, founder of Gully Gang and inspiration for Gully Boy."},
    {"name": "Mohit Chauhan", "bio": "Soulful Indian singer known for iconic rock and romantic tracks in Rockstar and Jab We Met."},
    {"name": "KK", "bio": "Legendary Indian playback singer whose emotive voice defined a generation of Bollywood classics."},
    {"name": "Sonu Nigam", "bio": "Master Indian playback singer celebrated for extraordinary versatility and iconic classics."},
    {"name": "Jasleen Royal", "bio": "Indian singer and composer known for hit romantic tracks like Heeriye and Ranjha."}
]

ADDITIONAL_ARTIST_NAMES = [
    "Jubin Nautiyal", "B Praak", "Sachin-Jigar", "Vishal-Shekhar", "Shankar-Ehsaan-Loy",
    "Amit Trivedi", "Ali Sethi", "Kaifi Khalil", "Shalmali Kholgade", "Benny Dayal",
    "Shafqat Amanat Ali", "Tochi Raina", "Rekha Bhardwaj", "Sukhwinder Singh", "Alka Yagnik"
]

ALBUM_NAMES = [
    "Brahmastra", "Shershaah", "Rockstar", "Aashiqui 2", "Yeh Jawaani Hai Deewani", "Tamasha",
    "Ae Dil Hai Mushkil", "Jab We Met", "Cocktail", "Gully Boy", "MoonChild Era", "Indie Chill"
]

GENRES = ["Hindi", "Punjabi", "Bollywood", "Romantic", "Indie", "Pop", "Sufi", "Hip-Hop"]
MOODS = ["romantic", "happy", "sad", "party", "focus", "calm", "workout", "travel"]

# 50 ICONIC INDIAN TRACKS
INDIAN_TRACKS = [
    {"title": "Kesariya", "artist": "Arijit Singh", "album": "Brahmastra", "genre": "Hindi", "mood": "romantic", "year": 2022},
    {"title": "Saiyaara", "artist": "Arijit Singh", "album": "Ek Tha Tiger", "genre": "Hindi", "mood": "sad", "year": 2012},
    {"title": "Tum Hi Ho", "artist": "Arijit Singh", "album": "Aashiqui 2", "genre": "Hindi", "mood": "romantic", "year": 2013},
    {"title": "Apna Bana Le", "artist": "Arijit Singh", "album": "Bhediya", "genre": "Hindi", "mood": "romantic", "year": 2022},
    {"title": "Channa Mereya", "artist": "Arijit Singh", "album": "Ae Dil Hai Mushkil", "genre": "Hindi", "mood": "sad", "year": 2016},
    {"title": "Raataan Lambiyan", "artist": "Jubin Nautiyal", "album": "Shershaah", "genre": "Hindi", "mood": "romantic", "year": 2021},
    {"title": "Ranjha", "artist": "B Praak", "album": "Shershaah", "genre": "Hindi", "mood": "sad", "year": 2021},
    {"title": "Tere Vaaste", "artist": "Sachin-Jigar", "album": "Zara Hatke Zara Bachke", "genre": "Hindi", "mood": "happy", "year": 2023},
    {"title": "Heeriye", "artist": "Jasleen Royal", "album": "Heeriye Single", "genre": "Hindi", "mood": "romantic", "year": 2023},
    {"title": "Kahani Suno 2.0", "artist": "Kaifi Khalil", "album": "Kahani Suno", "genre": "Hindi", "mood": "sad", "year": 2022},
    {"title": "Jo Tum Mere Ho", "artist": "Anuv Jain", "album": "Indie Originals", "genre": "Indie", "mood": "romantic", "year": 2024},
    {"title": "Baarishein", "artist": "Anuv Jain", "album": "Baarishein Single", "genre": "Indie", "mood": "calm", "year": 2018},
    {"title": "Liggi", "artist": "Ritviz", "album": "Dev", "genre": "Indie", "mood": "happy", "year": 2019},
    {"title": "Udd Gaye", "artist": "Ritviz", "album": "Bacardi House Party", "genre": "Indie", "mood": "party", "year": 2017},
    {"title": "Cold/Mess", "artist": "Prateek Kuhad", "album": "Cold/Mess EP", "genre": "Indie", "mood": "romantic", "year": 2018},
    {"title": "Excuses", "artist": "AP Dhillon", "album": "Hidden Gems", "genre": "Punjabi", "mood": "party", "year": 2020},
    {"title": "Brown Munde", "artist": "AP Dhillon", "album": "Not By Chance", "genre": "Punjabi", "mood": "workout", "year": 2020},
    {"title": "Lover", "artist": "Diljit Dosanjh", "album": "MoonChild Era", "genre": "Punjabi", "mood": "happy", "year": 2021},
    {"title": "Lemonade", "artist": "Diljit Dosanjh", "album": "Roar", "genre": "Punjabi", "mood": "party", "year": 2019},
    {"title": "Pasoori", "artist": "Ali Sethi", "album": "Coke Studio 14", "genre": "Punjabi", "mood": "happy", "year": 2022},
    {"title": "Agar Tum Saath Ho", "artist": "Arijit Singh", "album": "Tamasha", "genre": "Hindi", "mood": "sad", "year": 2015},
    {"title": "Kun Faya Kun", "artist": "A.R. Rahman", "album": "Rockstar", "genre": "Sufi", "mood": "calm", "year": 2011},
    {"title": "Nadaan Parinde", "artist": "Mohit Chauhan", "album": "Rockstar", "genre": "Hindi", "mood": "focus", "year": 2011},
    {"title": "Jai Ho", "artist": "A.R. Rahman", "album": "Slumdog Millionaire", "genre": "Hindi", "mood": "happy", "year": 2008},
    {"title": "Tere Bina", "artist": "A.R. Rahman", "album": "Guru", "genre": "Hindi", "mood": "romantic", "year": 2007},
    {"title": "Mitwa", "artist": "Shankar-Ehsaan-Loy", "album": "Kabhi Alvida Naa Kehna", "genre": "Hindi", "mood": "happy", "year": 2006},
    {"title": "Kal Ho Naa Ho", "artist": "Sonu Nigam", "album": "Kal Ho Naa Ho", "genre": "Hindi", "mood": "sad", "year": 2003},
    {"title": "Main Agar Kahoon", "artist": "Sonu Nigam", "album": "Om Shanti Om", "genre": "Hindi", "mood": "romantic", "year": 2007},
    {"title": "Teri Ore", "artist": "Shreya Ghoshal", "album": "Singh Is Kinng", "genre": "Hindi", "mood": "romantic", "year": 2008},
    {"title": "Pee Loon", "artist": "Mohit Chauhan", "album": "Once Upon a Time in Mumbaai", "genre": "Hindi", "mood": "romantic", "year": 2010},
    {"title": "Zara Sa", "artist": "KK", "album": "Jannat", "genre": "Hindi", "mood": "romantic", "year": 2008},
    {"title": "Labon Ko", "artist": "KK", "album": "Bhool Bhulaiyaa", "genre": "Hindi", "mood": "romantic", "year": 2007},
    {"title": "Tu Jaane Na", "artist": "Atif Aslam", "album": "Ajab Prem Ki Ghazab Kahani", "genre": "Hindi", "mood": "romantic", "year": 2009},
    {"title": "Tera Hone Laga Hoon", "artist": "Atif Aslam", "album": "Ajab Prem Ki Ghazab Kahani", "genre": "Hindi", "mood": "happy", "year": 2009},
    {"title": "Jeene Laga Hoon", "artist": "Atif Aslam", "album": "Ramaiya Vastavaiya", "genre": "Hindi", "mood": "happy", "year": 2013},
    {"title": "Shayad", "artist": "Arijit Singh", "album": "Love Aaj Kal", "genre": "Hindi", "mood": "romantic", "year": 2020},
    {"title": "Tum Se Hi", "artist": "Mohit Chauhan", "album": "Jab We Met", "genre": "Hindi", "mood": "romantic", "year": 2007},
    {"title": "Subhanallah", "artist": "Sreerama Chandra", "album": "Yeh Jawaani Hai Deewani", "genre": "Hindi", "mood": "romantic", "year": 2013},
    {"title": "Kabira", "artist": "Tochi Raina", "album": "Yeh Jawaani Hai Deewani", "genre": "Hindi", "mood": "calm", "year": 2013},
    {"title": "Balam Pichkari", "artist": "Vishal Dadlani", "album": "Yeh Jawaani Hai Deewani", "genre": "Hindi", "mood": "party", "year": 2013},
    {"title": "Badtameez Dil", "artist": "Benny Dayal", "album": "Yeh Jawaani Hai Deewani", "genre": "Hindi", "mood": "party", "year": 2013},
    {"title": "Ghodey Pe Sawaar", "artist": "Amit Trivedi", "album": "Qala", "genre": "Hindi", "mood": "happy", "year": 2022},
    {"title": "Naina Da Kya Kasoor", "artist": "Amit Trivedi", "album": "Andhadhun", "genre": "Hindi", "mood": "happy", "year": 2018},
    {"title": "Ghungroo", "artist": "Arijit Singh", "album": "War", "genre": "Hindi", "mood": "party", "year": 2019},
    {"title": "Nashe Si Chhad Gayi", "artist": "Arijit Singh", "album": "Befikre", "genre": "Hindi", "mood": "party", "year": 2016},
    {"title": "Kar Gayi Chull", "artist": "Badshah", "album": "Kapoor & Sons", "genre": "Hindi", "mood": "party", "year": 2016},
    {"title": "Garmi", "artist": "Badshah", "album": "Street Dancer 3D", "genre": "Hindi", "mood": "party", "year": 2020},
    {"title": "Apna Time Aayega", "artist": "Divine", "album": "Gully Boy", "genre": "Hip-Hop", "mood": "workout", "year": 2019},
    {"title": "Kohinoor", "artist": "Divine", "album": "Kohinoor", "genre": "Hip-Hop", "mood": "workout", "year": 2019},
    {"title": "Attention", "artist": "Charlie Puth", "album": "Voicenotes", "genre": "Pop", "mood": "happy", "year": 2017}
]

def generate_catalog():
    # 1. Generate Artists
    artists = []
    all_artist_names = []
    
    for i, data in enumerate(ARTIST_DATA):
        name = data["name"]
        all_artist_names.append(name)
        artists.append({
            "artist_id": f"art-{i+1}",
            "name": name,
            "profile_pic": ARTIST_PHOTOS[i % len(ARTIST_PHOTOS)],
            "bio": data["bio"],
            "monthly_listeners": (18000000 - (i * 800000)) + random.randint(1000, 50000),
            "similar_artists": []
        })
        
    for j, name in enumerate(ADDITIONAL_ARTIST_NAMES):
        all_artist_names.append(name)
        idx = len(artists)
        artists.append({
            "artist_id": f"art-{idx+1}",
            "name": name,
            "profile_pic": ARTIST_PHOTOS[idx % len(ARTIST_PHOTOS)],
            "bio": f"Indian music master {name}, crafting chart-topping Bollywood and regional tracks.",
            "monthly_listeners": (8500000 - (j * 200000)) + random.randint(1000, 20000),
            "similar_artists": []
        })
        
    for artist in artists:
        similars = [a["name"] for a in artists if a["name"] != artist["name"]]
        random_gen = random.Random(artist["name"])
        artist["similar_artists"] = random_gen.sample(similars, min(4, len(similars)))

    # 2. Populate 50 Indian Tracks
    tracks = []
    for i, item in enumerate(INDIAN_TRACKS):
        sound_num = (i % 16) + 1
        tracks.append({
            "track_id": f"ind-{i+1}",
            "title": item["title"],
            "artist": item["artist"],
            "album": item["album"],
            "genres": [item["genre"], "Indian"],
            "mood": item["mood"],
            "duration": 210 + (i * 3) % 90,
            "audio_url": f"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-{sound_num}.mp3",
            "cover_image": COVER_PHOTOS[i % len(COVER_PHOTOS)],
            "popularity": round(0.99 - (i * 0.005), 2),
            "type": "song",
            "release_year": item["year"]
        })

    # 3. Generate Podcasts
    podcasts = []
    podcast_titles = [
        {"title": "Bollywood Music Unplugged", "host": "Mirchi FM", "description": "Behind the scenes with Arijit Singh, A.R. Rahman & top Indian composers.", "cat": "Music"},
        {"title": "Coke Studio Stories", "host": "Coke Studio", "description": "Exploring South Asian fusion, folk roots, and modern Sufi music.", "cat": "Culture"},
        {"title": "The Indian Music Podcast", "host": "Gaana Originals", "description": "Deep-dives into classical ragas, indie pop, and Punjabi hip-hop.", "cat": "Arts"},
        {"title": "Desi Hip-Hop Uncut", "host": "Gully Gang Radio", "description": "Underground street rap from Mumbai, Delhi, and Punjab.", "cat": "Hip-Hop"},
        {"title": "Maestros of Melody", "host": "Spotify India", "description": "Interviews with legendary playback singers and music directors.", "cat": "Music"}
    ]
    
    for p_idx, pod in enumerate(podcast_titles):
        p_id = f"pod-{p_idx+1}"
        episodes = []
        for ep_idx in range(4):
            sound_num = 1 + ((p_idx * 4 + ep_idx) % 16)
            episodes.append({
                "episode_id": f"{p_id}-ep-{ep_idx+1}",
                "title": f"Episode {ep_idx+1}: {pod['title']} Special",
                "description": f"Exploring acoustic arrangements and interview highlights regarding {pod['title']}.",
                "duration": 1200 + (ep_idx * 150),
                "audio_url": f"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-{sound_num}.mp3",
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

    # 4. Curated Indian Playlists
    playlists = [
        {
            "playlist_id": "pl-chill",
            "name": "Bollywood Romance & Chill",
            "owner_id": "system",
            "is_public": True,
            "tracks": ["ind-1", "ind-2", "ind-3", "ind-4", "ind-5", "ind-9", "ind-10", "ind-11"],
            "description": "Unwind with the ultimate soulful Hindi romantic melodies."
        },
        {
            "playlist_id": "pl-energy",
            "name": "Punjabi Hype & Party Hits",
            "owner_id": "system",
            "is_public": True,
            "tracks": ["ind-16", "ind-17", "ind-18", "ind-19", "ind-20", "ind-40", "ind-41", "ind-47"],
            "description": "High-energy Punjabi beats and explosive Bollywood dance anthems."
        },
        {
            "playlist_id": "pl-stress",
            "name": "Indian Sufi & Calm Acoustic",
            "owner_id": "system",
            "is_public": True,
            "tracks": ["ind-12", "ind-15", "ind-21", "ind-22", "ind-23", "ind-25", "ind-37", "ind-39"],
            "description": "Soothing acoustic tunes and spiritual Sufi soundscapes."
        },
        {
            "playlist_id": "pl-focus",
            "name": "Indian Indie & Lo-Fi Flow",
            "owner_id": "system",
            "is_public": True,
            "tracks": ["ind-11", "ind-12", "ind-13", "ind-14", "ind-15", "ind-42", "ind-43", "ind-44"],
            "description": "Chill Indian indie pop and relaxing bedroom acoustic loops."
        }
    ]

    return artists, tracks, podcasts, playlists

DEFAULT_ARTISTS, DEFAULT_TRACKS, DEFAULT_PODCASTS, DEFAULT_PLAYLISTS = generate_catalog()
