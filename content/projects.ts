export type Project = {
  title: string;
  summary: string;
  tech: string[];
  link?: string;
  note?: string;
};

export type Paper = {
  title: string;
  venue: string;
  link?: string;
};

// User will supply 4 projects; page shows a "still being written" note while empty.
export const projects: Project[] = [];

export const papers: Paper[] = [
  {
    title:
      "Smart Farming Innovations for Maharashtra Using ML with Dual-Node LoRaWAN Connectivity",
    venue: "IEEE",
    link: "https://ieeexplore.ieee.org/document/11507500",
  },
  {
    title:
      "Gesture-Based Assistive Tool for Children with Speech and Hearing Impairments",
    venue:
      "Springer — presented at the 6th International Conference on Computer Vision and Robotics (CVR 2026)",
  },
];
