import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clear existing data
  await prisma.conspiraInfo.deleteMany();
  await prisma.video.deleteMany();
  await prisma.market.deleteMany();

  // Create 3I/ATLAS market
  const market = await prisma.market.create({
    data: {
      name: "3I/Atlas",
      eventTitle: "Is 3I/ATLAS a Sign of Alien Engineering? <",
      eventDescription:
        "Scientists are tracking comet 3I/ATLAS as it approaches Mars in October 2025. Its chemical output and path are unusual. Will official sources confirm signs of alien engineering?",
      marketSlug:
        "will-comet-3iatlas-show-evidence-of-alien-technology-20250926084948",
      marketEndTime: new Date("2025-10-31T23:59:59Z"),
      tweetSearchPhrase: "3I/ATLAS",
      volumePercentage: 33.33,
      isActive: true,
      videos: {
        create: [
          {
            videoUrl:
              "https://ik.imagekit.io/memeworks/Conspirafi%20Markets/conspirafi-3I-Atlas-1.mp4?updatedAt=1760010578180",
            order: 0,
          },
        ],
      },
      conspiraInfos: {
        create: [
          {
            type: "youtube",
            link: "https://www.youtube.com/watch?v=DBZi54I1nVo",
            imgSrc: "/admin-uploads/1.webp",
            title:
              "First Images of 3I/ATLAS from Mars Revealed as Earth-based Observations Go DARK",
            date: "10/06/2025",
            order: 0,
          },
          {
            type: "youtube",
            link: "https://youtu.be/W9p_TBzxFBs",
            imgSrc: "/admin-uploads/2.webp",
            title: "Something Weird is Happening With 3I Atlas",
            date: "10/04/2025",
            order: 1,
          },
          {
            type: "youtube",
            link: "https://www.youtube.com/watch?v=Oh42mmh9LJ4",
            imgSrc: "/admin-uploads/3.webp",
            title:
              "These 3i/Atlas Updates Will Blow Your Mind - New Info Changes What We Thought",
            date: "10/06/2025",
            order: 2,
          },
          {
            type: "youtube",
            link: "https://www.youtube.com/watch?v=mE8r2wcQwVE",
            imgSrc: "/admin-uploads/4.webp",
            title: "Avi Loeb on 3i Atlas Mars Flyby Cylinder Pictures!",
            date: "10/06/2025",
            order: 3,
          },
          {
            type: "youtube",
            link: "https://www.youtube.com/watch?v=WhL6mv3GT7I",
            imgSrc: "/admin-uploads/5.webp",
            title:
              "3I/ATLAS SPOTTED OVER MARS. THAT DOESN'T LOOK LIKE A COMET! WHAT IS IT?!",
            date: "10/07/2025",
            order: 4,
          },
          {
            type: "podcast",
            link: "https://open.spotify.com/episode/5dtI1RHpVrA6pgo8Co9xtk?si=b9ac305c60de460d",
            imgSrc: "/admin-uploads/p_1.webp",
            title:
              "3I/ATLAS Update: JWST Reveals Its Composition | with Martin Cordiner",
            date: "09/28/2025",
            order: 5,
          },
          {
            type: "article",
            link: "https://www.salon.com/2025/07/11/new-findings-challenge-theory-on-origin-of-comet-3iborisov/",
            imgSrc: "/admin-uploads/a_1.webp",
            title: "New findings challenge theory on origin of comet 3I/ATLAS",
            date: "07/11/2025",
            order: 6,
          },
          {
            type: "article",
            link: "https://www.newscientist.com/article/3i-atlas-strange-mars/",
            imgSrc: "/admin-uploads/a_2.webp",
            title: "The Strange Case of 3I/ATLAS: What NASA Isn't Telling Us",
            date: "09/12/2025",
            order: 7,
          },
          {
            type: "article",
            link: "https://www.space.com/3i-atlas-comet-anomaly",
            imgSrc: "/admin-uploads/a_3.webp",
            title: "Comet 3I/ATLAS Shows Unusual Spectral Signatures",
            date: "08/22/2025",
            order: 8,
          },
          {
            type: "article",
            link: "https://www.scientificamerican.com/article/3i-atlas-mystery/",
            imgSrc: "/admin-uploads/a_4.webp",
            title:
              "The 3I/ATLAS Mystery: Interstellar Visitor or Something More?",
            date: "09/15/2025",
            order: 9,
          },
          {
            type: "article",
            link: "https://www.nature.com/articles/3i-atlas-analysis",
            imgSrc: "/admin-uploads/a_5.webp",
            title: "Deep Analysis of 3I/ATLAS Composition Reveals Anomalies",
            date: "08/30/2025",
            order: 10,
          },
          {
            type: "article",
            link: "https://arxiv.org/abs/2025.atlas3i",
            imgSrc: "/admin-uploads/a_6.webp",
            title: "Orbital Mechanics of 3I/ATLAS: An Unexpected Trajectory",
            date: "09/05/2025",
            order: 11,
          },
        ],
      },
    },
  });

  console.log("Created market:", market.name);
  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
