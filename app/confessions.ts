export type ConfessionEntry = {
  number: string;
  category: string;
  theme: string;
  title: string;
  reference: string;
  verse: string;
  confession: string[];
  palette: {
    card: string;
    glow: string;
  };
};

export const confessions: ConfessionEntry[] = [
  {
    number: "001",
    category: "Blood of Jesus",
    theme: "Victory",
    title: "I overcome the devil by the blood of Jesus",
    reference: "Revelation 12:11",
    verse: "And they overcame him by the blood of the Lamb...",
    confession: [
      "I am an overcomer.",
      "I overcome Satan, his accusations, and his attacks by the blood of Jesus.",
      "The blood gives me victory every day.",
    ],
    palette: {
      card: "#ef4036",
      glow: "rgba(239, 64, 54, 0.30)",
    },
  },
  {
    number: "002",
    category: "Blood of Jesus",
    theme: "Redemption",
    title: "I am redeemed from sin and Satan",
    reference: "Ephesians 1:7",
    verse:
      "In Him we have redemption through His blood, the forgiveness of sins, according to the riches of His grace.",
    confession: [
      "I am redeemed by the blood of Jesus.",
      "I am no longer under the dominion of sin or Satan.",
      "I belong to God.",
    ],
    palette: {
      card: "#f04f3e",
      glow: "rgba(240, 79, 62, 0.30)",
    },
  },
  {
    number: "003",
    category: "Blood of Jesus",
    theme: "Cleansing",
    title: "My sins are forgiven and I am cleansed",
    reference: "1 John 1:7",
    verse: "The blood of Jesus Christ His Son cleanses us from all sin.",
    confession: [
      "The blood of Jesus has washed me clean.",
      "I am forgiven, purified, and free from every stain of sin.",
    ],
    palette: {
      card: "#f55c41",
      glow: "rgba(245, 92, 65, 0.31)",
    },
  },
  {
    number: "004",
    category: "Blood of Jesus",
    theme: "Righteousness",
    title: "I am justified and made righteous",
    reference: "Romans 5:9",
    verse:
      "Having now been justified by His blood, we shall be saved from wrath through Him.",
    confession: [
      "I am justified by the blood of Jesus.",
      "I stand before God as righteous, accepted, and not condemned.",
    ],
    palette: {
      card: "#f5633f",
      glow: "rgba(245, 99, 63, 0.31)",
    },
  },
  {
    number: "005",
    category: "Blood of Jesus",
    theme: "Access",
    title: "I have bold access to God's presence",
    reference: "Hebrews 10:19",
    verse: "Having boldness to enter the Holiest by the blood of Jesus.",
    confession: [
      "Because of the blood, I come boldly into God's presence.",
      "I am not rejected. I am welcomed.",
    ],
    palette: {
      card: "#f76e40",
      glow: "rgba(247, 110, 64, 0.31)",
    },
  },
  {
    number: "006",
    category: "Blood of Jesus",
    theme: "Sanctification",
    title: "I am sanctified and set apart for God",
    reference: "Hebrews 13:12",
    verse:
      "Jesus also, that He might sanctify the people with His own blood, suffered outside the gate.",
    confession: [
      "I am sanctified by the blood of Jesus.",
      "I am set apart for God's purpose and holy use.",
    ],
    palette: {
      card: "#f87745",
      glow: "rgba(248, 119, 69, 0.31)",
    },
  },
  {
    number: "007",
    category: "Blood of Jesus",
    theme: "Deliverance",
    title: "I am delivered from the power of darkness",
    reference: "Colossians 1:13-14",
    verse:
      "He has delivered us from the power of darkness and conveyed us into the kingdom of the Son of His love, in whom we have redemption through His blood, the forgiveness of sins.",
    confession: [
      "Through the blood, I am delivered from darkness.",
      "I walk in the light of God's kingdom.",
    ],
    palette: {
      card: "#fa8248",
      glow: "rgba(250, 130, 72, 0.32)",
    },
  },
  {
    number: "008",
    category: "Blood of Jesus",
    theme: "Peace",
    title: "I have peace with God",
    reference: "Colossians 1:20",
    verse: "Having made peace through the blood of His cross.",
    confession: [
      "The blood of Jesus has made peace between me and God.",
      "I am no longer an enemy. I am a child of God.",
    ],
    palette: {
      card: "#fb8d4d",
      glow: "rgba(251, 141, 77, 0.32)",
    },
  },
  {
    number: "009",
    category: "Blood of Jesus",
    theme: "Advocacy",
    title: "The blood speaks on my behalf",
    reference: "Hebrews 12:24",
    verse:
      "To Jesus the Mediator of the new covenant, and to the blood of sprinkling that speaks better things than that of Abel.",
    confession: [
      "The blood of Jesus speaks for me.",
      "Mercy, favor, forgiveness, and victory are speaking over my life.",
    ],
    palette: {
      card: "#fc9850",
      glow: "rgba(252, 152, 80, 0.33)",
    },
  },
  {
    number: "010",
    category: "Blood of Jesus",
    theme: "Protection",
    title: "I am protected and preserved by the blood",
    reference: "Exodus 12:13",
    verse:
      "When I see the blood, I will pass over you; and the plague shall not be on you to destroy you.",
    confession: [
      "The blood of Jesus is my protection.",
      "Evil passes over me.",
      "I am preserved and kept safe.",
    ],
    palette: {
      card: "#fca355",
      glow: "rgba(252, 163, 85, 0.33)",
    },
  },
  {
    number: "011",
    category: "Blood of Jesus",
    theme: "Belonging",
    title: "I belong to God. I am purchased by the blood",
    reference: "1 Corinthians 6:20",
    verse:
      "For you were bought at a price; therefore glorify God in your body and in your spirit, which are God's.",
    confession: [
      "I have been bought with the blood of Jesus.",
      "My life belongs to God.",
      "I live for His glory.",
    ],
    palette: {
      card: "#fdae57",
      glow: "rgba(253, 174, 87, 0.33)",
    },
  },
  {
    number: "012",
    category: "Blood of Jesus",
    theme: "Authority",
    title: "I have victory and authority through the blood",
    reference: "Revelation 5:9-10",
    verse:
      "You were slain, and have redeemed us to God by Your blood... and have made us kings and priests to our God.",
    confession: [
      "Through the blood, I reign in life.",
      "I walk in authority as a king and priest unto God.",
    ],
    palette: {
      card: "#feb75b",
      glow: "rgba(254, 183, 91, 0.33)",
    },
  },
  {
    number: "013",
    category: "Power Declaration",
    theme: "Daily Seal",
    title: "I seal today with the power of the blood of Jesus",
    reference: "Combined Daily Declaration",
    verse: "Based on Revelation 12:11 and the finished work of Christ.",
    confession: [
      "I overcome by the blood of Jesus.",
      "I am redeemed, forgiven, justified, and sanctified.",
      "The blood speaks for me, protects me, and gives me access to God.",
      "I walk in victory, authority, and divine preservation.",
      "I belong to God, purchased by the precious blood of Jesus. In Jesus' name, Amen.",
    ],
    palette: {
      card: "#ffbf63",
      glow: "rgba(255, 191, 99, 0.34)",
    },
  },
];
