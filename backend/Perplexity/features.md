
Features:
-Authentication System
-Chat with AI
-Chat History
-Message Storage
-AI with Internet Research Feature


DATA MODELLING:
- User{
    id,
    username,
    email,
    password,
    verified: yes or no,
    createdAt,
    updatedAt,
}

-Chat{
    id,
    user (Kis User ki chat hai),
    title,
    createdAt,
    updatedAt
}

-Message{
    id,
    chat (LKis chat ka message hai),
    Content (Message ke andar ka content),
    role: [user/ ai]

}
