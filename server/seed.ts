import { db } from "./db";
import { users, contents, translationProjects, glossaryTerms, translationMemory, activities } from "@shared/schema";

async function seedDatabase() {
  try {
    console.log("Starting database seeding...");

    // Create sample users
    const sampleUsers = await db.insert(users).values([
      {
        username: "christian_ko",
        email: "christian@example.com",
        password: "hashed_password_placeholder",
        firstName: "Christian",
        lastName: "Ko",
        role: "admin",
        profileImageUrl: null,
      },
      {
        username: "korean_transcriber",
        email: "transcriber@example.com",
        password: "hashed_password_placeholder",
        firstName: "Min",
        lastName: "Kim",
        role: "korean_transcriber",
        profileImageUrl: null,
      },
      {
        username: "english_translator",
        email: "translator@example.com",
        password: "hashed_password_placeholder",
        firstName: "Sarah",
        lastName: "Johnson",
        role: "english_translator",
        profileImageUrl: null,
      },
    ]).returning();

    console.log("Users created:", sampleUsers.length);

    // Create sample content
    const sampleContent = await db.insert(contents).values([
      {
        title: "Weekly Forum - Faith and Community",
        description: "Discussion on building strong faith communities based on Romans 12:1-8",
        event: "Weekly Forum",
        topic: "Romans 12:1-8",
        contentDate: new Date("2024-01-15"),
        koreanTranscription: `그러므로 형제들아 내가 하나님의 모든 자비하심으로 너희를 권하노니 너희 몸을 하나님이 기뻐하시는 거룩한 산 제물로 드리라 이는 너희가 드릴 영적 예배니라

너희는 이 세대를 본받지 말고 오직 마음을 새롭게 함으로 변화를 받아 하나님의 선하시고 기뻐하시고 온전하신 뜻이 무엇인지 분별하도록 하라

내게 주신 은혜로 말미암아 너희 각 사람에게 말하노니 마땅히 생각할 그 이상의 생각을 품지 말고 오직 하나님께서 각 사람에게 나누어 주신 믿음의 분량대로 지혜롭게 생각하라`,
        uploadedBy: sampleUsers[0].id,
        status: "ready_for_translation",
      },
      {
        title: "Bible Study - The Great Commission",
        description: "Exploring Matthew 28:16-20 and our calling to make disciples",
        event: "Bible Study",
        topic: "Matthew 28:16-20",
        contentDate: new Date("2024-01-22"),
        koreanTranscription: `열한 제자가 갈릴리에 가서 예수께서 지시하신 산에 이르러
예수를 뵈었으나 더러는 의심하는지라
예수께서 나아와 말씀하여 이르시되 하늘과 땅의 모든 권세를 내게 주셨으니
그러므로 너희는 가서 모든 민족을 제자로 삼아 아버지와 아들과 성령의 이름으로 세례를 베풀고
내가 너희에게 분부한 모든 것을 가르쳐 지키게 하라 볼지어다 내가 세상 끝날까지 너희와 항상 함께 있으리라 하시니라`,
        uploadedBy: sampleUsers[1].id,
        status: "draft",
      },
    ]).returning();

    console.log("Content created:", sampleContent.length);

    // Create translation projects
    const translationProjectsData = await db.insert(translationProjects).values([
      {
        contentId: sampleContent[0].id,
        sourceLanguage: "ko",
        targetLanguage: "en",
        assignedTo: sampleUsers[2].id,
        status: "in_progress",
        priority: "high",
        dueDate: new Date("2024-02-01"),
        progress: 65,
        translatedText: `Therefore, I urge you, brothers and sisters, in view of God's mercy, to offer your bodies as a living sacrifice, holy and pleasing to God—this is your true and proper worship.

Do not conform to the pattern of this world, but be transformed by the renewing of your mind. Then you will be able to test and approve what God's will is—his good, pleasing and perfect will.

For by the grace given me I say to every one of you: Do not think of yourself more highly than you ought, but rather think of yourself with sober judgment, in accordance with the faith God has distributed to each of you.`,
      },
      {
        contentId: sampleContent[1].id,
        sourceLanguage: "ko",
        targetLanguage: "en",
        assignedTo: sampleUsers[2].id,
        status: "pending",
        priority: "medium",
        dueDate: new Date("2024-02-15"),
        progress: 0,
        translatedText: null,
      },
    ]).returning();

    console.log("Translation projects created:", translationProjectsData.length);

    // Create glossary terms
    const glossaryData = await db.insert(glossaryTerms).values([
      {
        koreanTerm: "믿음",
        englishTerm: "faith",
        definition: "Complete trust or confidence in God and His promises",
        usage: "Used frequently in theological contexts to describe the foundation of Christian belief",
        partOfSpeech: "noun",
        category: "theological",
        tags: ["core-concept", "spiritual", "biblical"],
        addedBy: sampleUsers[0].id,
      },
      {
        koreanTerm: "은혜",
        englishTerm: "grace",
        definition: "The unmerited favor and love of God toward humanity",
        usage: "Central concept in Christian theology referring to God's gift of salvation",
        partOfSpeech: "noun",
        category: "theological",
        tags: ["salvation", "divine", "gift"],
        addedBy: sampleUsers[0].id,
      },
      {
        koreanTerm: "제자",
        englishTerm: "disciple",
        definition: "A follower and student of Jesus Christ",
        usage: "Refers to those who follow Christ and are called to make other disciples",
        partOfSpeech: "noun",
        category: "biblical",
        tags: ["discipleship", "following", "student"],
        addedBy: sampleUsers[2].id,
      },
      {
        koreanTerm: "예배",
        englishTerm: "worship",
        definition: "The act of showing reverence and adoration for God",
        usage: "Can refer to both formal religious services and personal devotion",
        partOfSpeech: "noun",
        category: "liturgical",
        tags: ["service", "reverence", "devotion"],
        addedBy: sampleUsers[1].id,
      },
    ]).returning();

    console.log("Glossary terms created:", glossaryData.length);

    // Create translation memory entries
    await db.insert(translationMemory).values([
      {
        sourceText: "하나님의 모든 자비하심으로",
        targetText: "in view of God's mercy",
        sourceLanguage: "ko",
        targetLanguage: "en",
        similarity: 100,
        contentId: sampleContent[0].id,
        createdBy: sampleUsers[2].id,
        usage_count: 1,
      },
      {
        sourceText: "너희 몸을 하나님이 기뻐하시는 거룩한 산 제물로 드리라",
        targetText: "offer your bodies as a living sacrifice, holy and pleasing to God",
        sourceLanguage: "ko",
        targetLanguage: "en",
        similarity: 100,
        contentId: sampleContent[0].id,
        createdBy: sampleUsers[2].id,
        usage_count: 1,
      },
    ]);

    // Create activity entries
    await db.insert(activities).values([
      {
        userId: sampleUsers[0].id,
        action: "uploaded",
        entityType: "content",
        entityId: sampleContent[0].id,
        description: `Uploaded new content: ${sampleContent[0].title}`,
      },
      {
        userId: sampleUsers[2].id,
        action: "updated",
        entityType: "project",
        entityId: translationProjectsData[0].id,
        description: "Updated project status to in_progress",
      },
      {
        userId: sampleUsers[0].id,
        action: "added",
        entityType: "glossary",
        entityId: glossaryData[0].id,
        description: `Added glossary term: ${glossaryData[0].koreanTerm} → ${glossaryData[0].englishTerm}`,
      },
    ]);

    console.log("Database seeding completed successfully!");
    
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => {
      console.log("Seeding finished");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Seeding failed:", error);
      process.exit(1);
    });
}

export { seedDatabase };