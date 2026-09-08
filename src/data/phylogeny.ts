import type { CladeMeta, TreeNode } from "../types";

// A hand-curated ~88-node phylogeny. Not a complete tree of life — a
// teaching tool covering the major branches with one or two representative
// species each. Divergence times are approximate; contested deep branch
// points are flagged as such rather than given false precision.

export const phylogeny: TreeNode = {
  id: "luca",
  name: "LUCA",
  common: "Last Universal Common Ancestor",
  rank: "Origin",
  time: "~4.2 bya (estimates range 3.5–4.2 bya)",
  blurb:
    "The single-celled organism, already equipped with DNA, ribosomes, and ATP-based metabolism, that all known life descends from.",
  children: [
    {
      id: "bacteria",
      name: "Bacteria",
      rank: "Domain",
      color: "bacteria",
      time: "~3.5–4.0 bya (Bacteria/Archaea split, poorly constrained)",
      blurb:
        "One of the two prokaryotic domains; bacterial cells lack a membrane-bound nucleus but dominate nearly every environment on Earth.",
      children: [
        {
          id: "proteobacteria",
          name: "Proteobacteria",
          rank: "Phylum",
          innovation: {
            short: "outer membrane",
            text: "Evolved a second, outer cell membrane surrounding the inner plasma membrane — the defining gram-negative cell wall.",
          },
          blurb:
            "The most metabolically diverse bacterial phylum, spanning photosynthetic purple bacteria, nitrogen-fixing symbionts, and pathogens.",
          children: [
            {
              id: "e-coli",
              name: "Escherichia coli",
              common: "E. coli",
              rank: "Species",
              blurb:
                "The workhorse of molecular biology; strain K-12 has had its genome sequenced and manipulated more than almost any other organism on Earth.",
            },
          ],
        },
        {
          id: "cyanobacteria",
          name: "Cyanobacteria",
          rank: "Phylum",
          innovation: {
            short: "oxygenic photosynthesis",
            text: "Evolved oxygenic photosynthesis — splitting water with two linked photosystems and releasing O₂ as a byproduct.",
          },
          blurb:
            "Invented oxygenic photosynthesis, triggering the Great Oxidation Event roughly 2.4 billion years ago and transforming Earth's atmosphere.",
          children: [
            {
              id: "prochlorococcus",
              name: "Prochlorococcus marinus",
              rank: "Species",
              blurb:
                "At under 1 micrometer across, the smallest and most abundant photosynthetic organism on Earth, producing an estimated 5% of global oxygen.",
            },
          ],
        },
        {
          id: "firmicutes",
          name: "Firmicutes",
          rank: "Phylum",
          innovation: {
            short: "endospores",
            text: "Evolved the ability to form dormant, thick-walled endospores that survive heat, radiation, and drying.",
          },
          blurb:
            "Mostly gram-positive bacteria, many able to form dormant endospores that survive extreme heat, radiation, and desiccation.",
          children: [
            {
              id: "b-subtilis",
              name: "Bacillus subtilis",
              rank: "Species",
              blurb:
                "A soil bacterium and genetics workhorse whose endospores can remain dormant and viable for years, resisting boiling and disinfectants.",
            },
          ],
        },
        {
          id: "actinobacteria",
          name: "Actinobacteria",
          rank: "Phylum",
          innovation: {
            short: "branching filaments",
            text: "Evolved branching, fungus-like filamentous growth and a high-GC genome adapted for producing complex antibiotics.",
          },
          blurb:
            "Filamentous, often soil-dwelling bacteria responsible for the earthy smell of rain (geosmin) and roughly two-thirds of clinically used antibiotics.",
          children: [
            {
              id: "s-coelicolor",
              name: "Streptomyces coelicolor",
              rank: "Species",
              blurb:
                "Produces multiple classes of antibiotics on its own and is a model organism for studying how bacteria manufacture complex natural compounds.",
            },
          ],
        },
        {
          id: "bacteroidetes",
          name: "Bacteroidetes",
          rank: "Phylum",
          innovation: {
            short: "polysaccharide digestion",
            text: "Evolved specialized enzyme clusters for breaking down the complex plant and host carbohydrates other microbes can't touch.",
          },
          blurb:
            "Abundant gut- and environment-dwelling bacteria specialized in breaking down complex polysaccharides that host enzymes can't digest.",
          children: [
            {
              id: "b-fragilis",
              name: "Bacteroides fragilis",
              rank: "Species",
              blurb:
                "A dominant member of the human gut microbiome that helps digest complex carbohydrates and helps train the immune system.",
            },
          ],
        },
        {
          id: "spirochaetes",
          name: "Spirochaetes",
          rank: "Phylum",
          innovation: {
            short: "internal flagella",
            text: "Evolved flagella housed inside the outer membrane (periplasmic), producing a corkscrew shape and motion instead of external whips.",
          },
          blurb:
            "Distinctively helical, corkscrew-shaped bacteria that move by rotating flagella housed inside their outer membrane.",
          children: [
            {
              id: "t-pallidum",
              name: "Treponema pallidum",
              rank: "Species",
              blurb:
                "The causative agent of syphilis; it has never been grown continuously in a lab dish, only in living hosts or complex cell cultures.",
            },
          ],
        },
      ],
    },
    {
      // Modern two-domain / eocyte model: only Bacteria and Archaea are
      // primary domains. Eukarya is not a third, parallel lineage here —
      // it's nested within Archaea, emerging specifically from among the
      // Asgard archaea (Heimdallarchaeia, per Eme et al. 2023, Nature).
      // This revises Woese's original 1990 trichotomy in light of Asgard
      // genomics and is what the current Open Tree of Life synthesis and
      // contemporary genomic consensus depict.
      id: "archaea",
      name: "Archaea",
      rank: "Domain",
      color: "archaea",
      time: "~3.5–4.0 bya (domain-level divergence from LUCA, poorly constrained)",
      blurb:
        "One of the two primary domains of life — prokaryotic like Bacteria, but genetically distinct, and, per the modern two-domain model, the domain Eukarya itself emerged from.",
      children: [
        {
          id: "euryarchaeota",
          name: "Euryarchaeota",
          rank: "Phylum",
          innovation: {
            short: "methanogenesis / halotolerance",
            text: "Evolved methane-producing metabolism in some lineages and extreme salt tolerance in others.",
          },
          blurb:
            "An extremely diverse archaeal group including extreme halophiles, methanogens, and thermophiles that push the limits of habitable conditions.",
          children: [
            {
              id: "h-salinarum",
              name: "Halobacterium salinarum",
              rank: "Species",
              blurb:
                "Thrives in saturated brine up to five times seawater salinity, using a light-driven proton pump that gives salt ponds a striking pink hue.",
            },
          ],
        },
        {
          id: "dpann",
          name: "DPANN",
          rank: "Clade",
          blurb:
            "A superphylum of archaea with unusually small cells and genomes, many living as symbionts or parasites on other archaea. The name comes from its first-described member phyla (Diapherotrites, Parvarchaeota, Aenigmarchaeota, Nanoarchaeota, Nanohaloarchaeota).",
          children: [
            {
              id: "n-equitans",
              name: "Nanoarchaeum equitans",
              rank: "Species",
              blurb:
                "One of the smallest known cellular genomes (~490 kb); an obligate symbiont permanently attached to another archaeon, Ignicoccus hospitalis, unable to survive on its own.",
            },
          ],
        },
        {
          id: "tack",
          name: "TACK superphylum",
          rank: "Clade",
          blurb:
            "A superphylum named for its first four member phyla — Thaumarchaeota, Aigarchaeota, Crenarchaeota, Korarchaeota. Molecular evidence places Asgard archaea, and Eukarya within them, as TACK's closest relatives.",
          children: [
            {
              id: "crenarchaeota",
              name: "Crenarchaeota",
              rank: "Phylum",
              innovation: {
                short: "extreme thermophily",
                text: "Adapted to extreme heat, with some lineages fixing carbon via a reverse-TCA-like pathway rather than photosynthesis.",
              },
              blurb:
                "Classically defined by extreme thermophiles found in hot, acidic environments like sulfur-rich hot springs and hydrothermal vents.",
              children: [
                {
                  id: "s-acidocaldarius",
                  name: "Sulfolobus acidocaldarius",
                  rank: "Species",
                  blurb:
                    "Grows optimally around 75–80°C at pH 2–3, in acidic hot springs like those of Yellowstone.",
                },
              ],
            },
            {
              id: "thaumarchaeota",
              name: "Thaumarchaeota",
              rank: "Phylum",
              blurb:
                "Ammonia-oxidizing archaea now thought to be among the most abundant organisms in the ocean, driving a major share of global nitrification.",
              children: [
                {
                  id: "n-maritimus",
                  name: "Nitrosopumilus maritimus",
                  rank: "Species",
                  blurb:
                    "A marine ammonia-oxidizer so numerous it may be one of the single most abundant microorganisms on Earth, central to the ocean's nitrogen cycle.",
                },
              ],
            },
          ],
        },
        {
          id: "asgard",
          name: "Asgardarchaeota",
          common: "Asgard archaea",
          rank: "Clade",
          innovation: {
            short: "actin & membrane remodeling",
            text: "Evolved actin-family proteins and membrane-remodeling machinery foreshadowing the complex eukaryotic cell.",
          },
          blurb:
            "Discovered from deep-sea sediment metagenomes in the 2010s and named after Norse mythology, Asgard archaea are eukaryotes' closest known prokaryotic relatives — and, per the two-domain model, literally the group Eukarya branches from within.",
          children: [
            {
              id: "lokiarchaeia",
              name: "Lokiarchaeia",
              rank: "Clade",
              blurb:
                "The first Asgard lineage discovered (2015, near the Loki's Castle hydrothermal vent field) and the first ever cultured, in 2020.",
              children: [
                {
                  id: "prometheoarchaeum",
                  name: "Candidatus Prometheoarchaeum syntrophicum",
                  rank: "Species",
                  blurb:
                    "First cultured in 2020 after a decade-long effort; it grows long branching membrane protrusions that may parallel how the ancestral eukaryotic cell engulfed its mitochondrial ancestor.",
                },
              ],
            },
            {
              id: "heimdallarchaeia",
              name: "Heimdallarchaeia",
              rank: "Clade",
              time: "~2.7 bya (estimates vary widely and are contested; the Eukarya/Heimdallarchaeia split)",
              blurb:
                "Named after the Norse god Heimdall. A 2023 phylogenomic study (Eme et al., Nature) identified this specific Asgard lineage — not Asgard archaea broadly — as the closest known relative of the eukaryotic nuclear lineage.",
              children: [
                {
      id: "eukarya",
      name: "Eukarya",
      rank: "Clade",
      time: "~1.8–2.1 bya (estimates vary widely for the root of the eukaryotic crown lineage — this is younger than, and distinct from, the deeper Heimdallarchaeia split above)",
      blurb:
        "Defined by a membrane-bound nucleus and internal compartmentalization. In the modern two-domain view, Eukarya isn't a separate domain but a lineage nested within Archaea — its host cell was an Asgard archaeon, with mitochondria derived from an engulfed bacterial endosymbiont.",
      children: [
        {
          id: "amorphea",
          name: "Amorphea",
          rank: "Supergroup",
          time: "~1.1 bya (estimates vary widely)",
          blurb:
            "A eukaryotic supergroup uniting Amoebozoa and Obazoa (which contains Opisthokonta) — generally amoeboid or single-flagellated cells, without the plastid-linked history seen in Diaphoretickes.",
          children: [
            {
              id: "opisthokonta",
          name: "Opisthokonta",
          rank: "Clade",
          time: "~1.1 bya (animal/fungi split, approximate)",
          blurb:
            "Includes animals, fungi, and their closest single-celled relatives; named for the single posterior flagellum found in the sperm and spores of this group.",
          children: [
            {
              id: "animalia",
              name: "Animalia",
              rank: "Kingdom",
              color: "animalia",
              time: "~800 mya (approximate)",
              blurb:
                "Multicellular, heterotrophic organisms that develop from an embryo and, at some life stage, possess nervous tissue and mobility.",
              children: [
                {
                  id: "porifera",
                  name: "Porifera",
                  rank: "Phylum",
                  innovation: {
                    short: "no true tissues",
                    text: "Never evolved true tissues or a nervous system — cells remain totipotent and can reaggregate after being disassociated.",
                  },
                  blurb:
                    "The sponges — the simplest animal phylum, lacking true tissues or organs, and among the first animal lineages to diverge.",
                  children: [
                    {
                      id: "venus-flower-basket",
                      name: "Euplectella aspergillum",
                      common: "Venus flower basket",
                      rank: "Species",
                      blurb:
                        "Builds an intricate silica lattice skeleton so precise it has inspired fiber-optic and architectural engineering; traditionally given in Japan as a wedding gift symbolizing lifelong bonds.",
                    },
                  ],
                },
                {
                  id: "cnidaria",
                  name: "Cnidaria",
                  rank: "Phylum",
                  innovation: {
                    short: "true tissues + radial symmetry",
                    text: "Evolved true tissues and radial symmetry, plus specialized stinging cells (cnidocytes) for prey capture and defense.",
                  },
                  blurb:
                    "Radially symmetric animals armed with stinging cells called cnidocytes, including jellyfish, corals, and anemones.",
                  children: [
                    {
                      id: "moon-jelly",
                      name: "Aurelia aurita",
                      common: "moon jelly",
                      rank: "Species",
                      blurb:
                        "Recognizable by four horseshoe-shaped gonads visible through its translucent bell; polyps have flown on space shuttle missions to study gravity's effect on development.",
                    },
                  ],
                },
                {
                  id: "platyhelminthes",
                  name: "Platyhelminthes",
                  rank: "Phylum",
                  innovation: {
                    short: "bilateral symmetry",
                    text: "Evolved bilateral symmetry and cephalization (a defined head end) — but still no internal body cavity (coelom).",
                  },
                  blurb:
                    "Flatworms — bilaterally symmetric but lacking a body cavity or circulatory system.",
                  children: [
                    {
                      id: "planarian",
                      name: "Schmidtea mediterranea",
                      common: "planarian",
                      rank: "Species",
                      blurb:
                        "Famous for near-limitless regeneration: cut into over 200 pieces, each fragment can regrow into a complete worm, including a new brain.",
                    },
                  ],
                },
                {
                  id: "mollusca",
                  name: "Mollusca",
                  rank: "Phylum",
                  innovation: {
                    short: "foot, mantle & shell",
                    text: "Evolved a muscular foot, a shell-secreting mantle, and (in most lineages) a rasping feeding organ called a radula.",
                  },
                  blurb:
                    "The second-largest animal phylum by species count, spanning snails, clams, squid, and octopuses, unified by a muscular foot and often a mantle-secreted shell.",
                  children: [
                    {
                      id: "octopus",
                      name: "Octopus vulgaris",
                      common: "common octopus",
                      rank: "Species",
                      blurb:
                        "Roughly two-thirds of its ~500 million neurons sit in its arms rather than its central brain, letting each arm process sensory information semi-independently.",
                    },
                  ],
                },
                {
                  id: "annelida",
                  name: "Annelida",
                  rank: "Phylum",
                  innovation: {
                    short: "segmentation",
                    text: "Evolved true segmentation — repeated body units that can move and be innervated semi-independently.",
                  },
                  blurb:
                    "Segmented worms whose bodies divide into repeating ring-like units, each often housing its own set of organs.",
                  children: [
                    {
                      id: "earthworm",
                      name: "Lumbricus terrestris",
                      common: "earthworm",
                      rank: "Species",
                      blurb:
                        "Darwin spent decades studying this species, estimating that earthworms in English pastures could turn over ten tons of soil per acre annually.",
                    },
                  ],
                },
                {
                  id: "arthropoda",
                  name: "Arthropoda",
                  rank: "Phylum",
                  innovation: {
                    short: "exoskeleton + jointed limbs",
                    text: "Evolved a hardened external skeleton and jointed appendages, requiring periodic molting (ecdysis) to grow.",
                  },
                  blurb:
                    "The most species-rich animal phylum by far, defined by a segmented body, jointed limbs, and a hard exoskeleton shed to grow.",
                  children: [
                    {
                      id: "drosophila",
                      name: "Drosophila melanogaster",
                      common: "fruit fly",
                      rank: "Species",
                      blurb:
                        "A cornerstone genetics model since the 1900s; Thomas Hunt Morgan's work with it established that genes are carried on chromosomes.",
                    },
                  ],
                },
                {
                  id: "echinodermata",
                  name: "Echinodermata",
                  rank: "Phylum",
                  innovation: {
                    short: "pentaradial symmetry",
                    text: "Larvae are bilaterally symmetric, but adults evolved pentaradial (five-part) symmetry and a unique water vascular system.",
                  },
                  blurb:
                    "Exclusively marine animals with five-fold radial symmetry as adults and a unique water vascular system powering hundreds of tube feet.",
                  children: [
                    {
                      id: "bat-star",
                      name: "Patiria miniata",
                      common: "bat star",
                      rank: "Species",
                      blurb:
                        "Can evert its stomach out through its mouth to digest prey externally, then retract it — a strategy shared across many sea stars.",
                    },
                  ],
                },
                {
                  id: "chordata",
                  name: "Chordata",
                  rank: "Phylum",
                  innovation: {
                    short: "notochord",
                    text: "Evolved a dorsal hollow nerve cord, a stiffening notochord, and pharyngeal slits at some point in development.",
                  },
                  blurb:
                    "Animals with, at some life stage, a dorsal nerve cord, notochord, pharyngeal slits, and post-anal tail; vertebrates are the most familiar subgroup.",
                  children: [
                    {
                      id: "chondrichthyes",
                      name: "Chondrichthyes",
                      rank: "Class",
                      blurb:
                        "Cartilaginous fish — skates, rays, and sharks — whose skeletons are built from cartilage rather than bone.",
                      children: [
                        {
                          id: "great-white",
                          name: "Carcharodon carcharias",
                          common: "great white shark",
                          rank: "Species",
                          blurb:
                            "Detects the faint electrical field of a hidden prey's heartbeat using electroreceptor organs called the ampullae of Lorenzini.",
                        },
                      ],
                    },
                    {
                      id: "amphibia",
                      name: "Amphibia",
                      rank: "Class",
                      blurb:
                        "Cold-blooded vertebrates that typically transition from aquatic, gill-breathing larvae to air-breathing adults.",
                      children: [
                        {
                          id: "axolotl",
                          name: "Ambystoma mexicanum",
                          common: "axolotl",
                          rank: "Species",
                          blurb:
                            "Uniquely among salamanders, it typically never undergoes metamorphosis — and can fully regenerate lost limbs, spinal cord, and parts of its heart and brain.",
                        },
                      ],
                    },
                    {
                      id: "reptilia",
                      name: "Reptilia",
                      rank: "Class",
                      blurb:
                        "Scaled, air-breathing vertebrates including lizards, snakes, turtles, and crocodilians, most laying shelled eggs on land.",
                      children: [
                        {
                          id: "nile-crocodile",
                          name: "Crocodylus niloticus",
                          common: "Nile crocodile",
                          rank: "Species",
                          blurb:
                            "Has one of the most sophisticated hearts of any reptile, with a nearly fully divided four-chambered structure closer to a bird's or mammal's than a lizard's.",
                        },
                      ],
                    },
                    {
                      id: "aves",
                      name: "Aves",
                      rank: "Class",
                      blurb:
                        "Feathered, warm-blooded, egg-laying vertebrates descended from theropod dinosaurs; modern classification treats birds as a subgroup of Reptilia.",
                      children: [
                        {
                          id: "raven",
                          name: "Corvus corax",
                          common: "common raven",
                          rank: "Species",
                          blurb:
                            "Can plan for future events, use tools, and hold grudges against specific humans who have wronged them — cognitive feats once thought unique to great apes.",
                        },
                      ],
                    },
                    {
                      id: "mammalia",
                      name: "Mammalia",
                      rank: "Class",
                      time: "~180 mya (approximate, monotreme/therian split)",
                      blurb:
                        "Warm-blooded vertebrates defined by hair or fur, mammary glands, and, in most lineages, live birth; split early into egg-laying, pouched, and placental lineages.",
                      children: [
                        {
                          id: "platypus",
                          name: "Ornithorhynchus anatinus",
                          common: "platypus",
                          rank: "Species",
                          blurb:
                            "One of only five living monotreme species — mammals that lay eggs. Males also deliver venom through spurs on their hind legs, a trait almost unheard of among mammals.",
                        },
                        {
                          id: "human",
                          name: "Homo sapiens",
                          common: "human",
                          rank: "Species",
                          blurb:
                            "The species compiling this very tree. Anatomically modern humans emerged roughly 300,000 years ago in Africa and are the only surviving member of genus Homo — you're part of this tree too.",
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              id: "fungi",
              name: "Fungi",
              rank: "Kingdom",
              color: "fungi",
              blurb:
                "Heterotrophic eukaryotes that digest food externally by secreting enzymes, then absorb the products — unlike animals, which ingest, or plants, which photosynthesize.",
              children: [
                {
                  id: "chytridiomycota",
                  name: "Chytridiomycota",
                  rank: "Phylum",
                  innovation: {
                    short: "flagellated spores",
                    text: "Retained flagellated, swimming spores — the ancestral fungal condition lost in every other fungal phylum.",
                  },
                  blurb:
                    "The only fungal phylum with flagellated, swimming spores, a trait linking them to fungi's likely aquatic single-celled ancestors.",
                  children: [
                    {
                      id: "b-dendrobatidis",
                      name: "Batrachochytrium dendrobatidis",
                      rank: "Species",
                      blurb:
                        "The chytrid fungus driving amphibian population collapses and extinctions worldwide since the late 20th century — one of the most destructive pathogens documented for a whole vertebrate class.",
                    },
                  ],
                },
                {
                  id: "zygomycota",
                  name: "Zygomycota",
                  rank: "Phylum",
                  innovation: {
                    short: "zygospores",
                    text: "Evolved sexual reproduction by fusing hyphae into a single, thick-walled resting zygospore.",
                  },
                  blurb:
                    "Named for the tough zygospores formed when compatible mating strains fuse; many are fast-growing molds and decomposers.",
                  children: [
                    {
                      id: "r-stolonifer",
                      name: "Rhizopus stolonifer",
                      common: "black bread mold",
                      rank: "Species",
                      blurb:
                        "Its wind-dispersed spores can colonize a slice of bread and produce visible fuzzy growth within just a couple of days.",
                    },
                  ],
                },
                {
                  id: "ascomycota",
                  name: "Ascomycota",
                  rank: "Phylum",
                  innovation: {
                    short: "spores in an ascus",
                    text: "Evolved spores produced inside a sac-like structure called an ascus, typically in groups of eight.",
                  },
                  blurb:
                    "The largest fungal phylum, defined by spores produced inside a sac-like structure called an ascus; includes molds, most lichen fungal partners, and yeasts.",
                  children: [
                    {
                      id: "s-cerevisiae",
                      name: "Saccharomyces cerevisiae",
                      common: "brewer's/baker's yeast",
                      rank: "Species",
                      blurb:
                        "The first eukaryote to have its genome fully sequenced (1996), and one of the most important organisms in both food history and cell biology research.",
                    },
                  ],
                },
                {
                  id: "basidiomycota",
                  name: "Basidiomycota",
                  rank: "Phylum",
                  innovation: {
                    short: "spores on a basidium",
                    text: "Evolved spores produced externally on a club-shaped basidium, typically lining the gills of a mushroom.",
                  },
                  blurb:
                    "Fungi that produce spores on a club-shaped structure called a basidium, usually inside mushroom gills — the group most people picture when they think 'fungus'.",
                  children: [
                    {
                      id: "a-bisporus",
                      name: "Agaricus bisporus",
                      common: "button mushroom",
                      rank: "Species",
                      blurb:
                        "The common button, cremini, and portobello mushroom are all this same species, harvested at different stages of maturity.",
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          id: "amoebozoa",
          name: "Amoebozoa",
          rank: "Clade",
          color: "amoebozoa",
          time: "~1.3 bya (approximate)",
          blurb:
            "Amoeboid eukaryotes that move and feed using blunt, blob-like pseudopods, unlike the thin branching or hair-covered types seen elsewhere in the eukaryotic tree.",
          children: [
            {
              id: "dictyostelium",
              name: "Dictyostelium discoideum",
              common: "social amoeba",
              rank: "Species",
              blurb:
                "Lives as separate single cells until food runs low, then thousands aggregate into a multicellular slug that migrates and forms a stalk and fruiting body to disperse spores.",
            },
            {
              id: "amoeba-proteus",
              name: "Amoeba proteus",
              rank: "Species",
              blurb:
                "A large freshwater amoeba that continuously reshapes its entire cell body by extending and retracting pseudopods — the classic textbook amoeba.",
            },
          ],
        },
      ],
    },
    {
      id: "diaphoretickes",
      name: "Diaphoretickes",
      rank: "Supergroup",
      time: "~1.5 bya (estimates vary widely)",
      blurb:
        "A eukaryotic supergroup uniting Archaeplastida, SAR, and Discoba — lineages with a complex, often plastid-linked evolutionary history distinct from the Amorphea (animal/fungi/amoeba) side of the eukaryotic tree.",
      children: [
        {
          id: "archaeplastida",
          name: "Archaeplastida",
          rank: "Clade",
          color: "archaeplastida",
          time: "~1.5 bya (estimates vary widely for the primary chloroplast endosymbiosis)",
          blurb:
            "Nearly all photosynthetic eukaryotes trace back to this single group, whose ancestor engulfed a cyanobacterium that became the chloroplast.",
          children: [
            {
              id: "chlorophyta",
              name: "Chlorophyta",
              rank: "Phylum",
              innovation: {
                short: "chlorophyll a+b, motile cells",
                text: "Retained motile, flagellated cells and the chlorophyll a+b pigment pair — the ancestral condition shared with land plants.",
              },
              blurb:
                "The green algae — the closest algal relatives of land plants, ranging from single swimming cells to large multicellular seaweeds.",
              children: [
                {
                  id: "chlamydomonas",
                  name: "Chlamydomonas reinhardtii",
                  rank: "Species",
                  blurb:
                    "A single-celled green alga with two whip-like flagella, widely used to study photosynthesis, flagellar motion, and the light-sensing eyespot that steers it toward light.",
                },
              ],
            },
            {
              id: "rhodophyta",
              name: "Rhodophyta",
              rank: "Phylum",
              innovation: {
                short: "lost flagella",
                text: "Lost flagella entirely — no stage of the life cycle swims — while evolving phycoerythrin pigments for photosynthesis in deep water.",
              },
              blurb:
                "The red algae, colored by phycoerythrin pigments that let them photosynthesize efficiently in deep, dim water; among the oldest known eukaryotic fossils.",
              children: [
                {
                  id: "porphyra",
                  name: "Porphyra umbilicalis",
                  common: "nori",
                  rank: "Species",
                  blurb:
                    "The seaweed dried into sheets to wrap sushi; a gene for digesting its cell wall was found to have transferred from marine bacteria into the gut microbiome of some Japanese populations.",
                },
              ],
            },
            {
              id: "bryophyta",
              name: "Bryophyta",
              rank: "Phylum",
              innovation: {
                short: "cuticle & stomata",
                text: "Evolved a waxy cuticle and pore-like openings for life on land, but never evolved vascular tissue (no xylem/phloem).",
              },
              blurb:
                "The mosses — non-vascular land plants lacking true roots, absorbing water directly through their surface, with the haploid gametophyte as the dominant life stage.",
              children: [
                {
                  id: "physcomitrium",
                  name: "Physcomitrium patens",
                  rank: "Species",
                  blurb:
                    "Widely used in plant biology because it can undergo highly efficient homologous recombination, letting researchers edit specific genes much like in yeast.",
                },
              ],
            },
            {
              id: "pteridophyta",
              name: "Pteridophyta",
              rank: "Phylum",
              innovation: {
                short: "vascular tissue",
                text: "Evolved vascular tissue (xylem and phloem) for internal water and nutrient transport, enabling taller growth.",
              },
              blurb:
                "Ferns and their relatives — vascular plants that reproduce by spores rather than seeds, an evolutionary step between mosses and seed plants.",
              children: [
                {
                  id: "bracken-fern",
                  name: "Pteridium aquilinum",
                  common: "bracken fern",
                  rank: "Species",
                  blurb:
                    "One of the most widespread vascular plants on Earth, found on every continent except Antarctica, and among the few ferns considered toxic to livestock.",
                },
              ],
            },
            {
              id: "gymnosperms",
              name: "Gymnosperms",
              rank: "Phylum",
              innovation: {
                short: "seeds",
                text: "Evolved the seed — an embryo packaged with nutrients and a protective coat — freeing reproduction from standing water.",
              },
              blurb:
                "Seed plants whose seeds sit exposed on cone scales rather than enclosed in a fruit; includes conifers, cycads, and ginkgos.",
              children: [
                {
                  id: "bristlecone-pine",
                  name: "Pinus longaeva",
                  common: "Great Basin bristlecone pine",
                  rank: "Species",
                  blurb:
                    "Individual trees have been dated to over 4,800 years old, making them among the oldest known living non-clonal organisms on Earth.",
                },
              ],
            },
            {
              id: "angiosperms",
              name: "Angiosperms",
              rank: "Phylum",
              innovation: {
                short: "flowers & fruit",
                text: "Evolved the flower and an enclosed ovary (fruit), enabling coevolution with pollinators and seed dispersers.",
              },
              blurb:
                "Flowering plants — seed plants whose seeds develop enclosed in an ovary; the most species-rich plant group, roughly 90% of living plant species.",
              children: [
                {
                  id: "arabidopsis",
                  name: "Arabidopsis thaliana",
                  rank: "Species",
                  blurb:
                    "A small weed in the mustard family that became the standard plant genetics model, in part because it was the first plant genome ever fully sequenced, in 2000.",
                },
              ],
            },
          ],
        },
        {
          id: "sar",
          name: "SAR",
          rank: "Clade",
          color: "sar",
          time: "~1 bya (approximate, contested)",
          blurb:
            "A supergroup uniting Stramenopiles, Alveolates, and Rhizaria — three eukaryotic lineages linked mainly by molecular evidence rather than shared visible traits.",
          children: [
            {
              id: "stramenopiles",
              name: "Stramenopiles",
              rank: "Clade",
              blurb:
                "Organisms characterized, in flagellated stages, by one hairy and one smooth flagellum; includes brown algae, diatoms, and water molds.",
              children: [
                {
                  id: "giant-kelp",
                  name: "Macrocystis pyrifera",
                  common: "giant kelp",
                  rank: "Species",
                  blurb:
                    "The largest of the brown algae, able to grow up to 60 cm (2 feet) per day, forming underwater forests that support entire coastal ecosystems.",
                },
              ],
            },
            {
              id: "alveolates",
              name: "Alveolates",
              rank: "Clade",
              blurb:
                "Defined by small membrane-bound sacs (alveoli) just under the cell surface; includes dinoflagellates, ciliates, and apicomplexan parasites.",
              children: [
                {
                  id: "p-falciparum",
                  name: "Plasmodium falciparum",
                  rank: "Species",
                  blurb:
                    "The parasite responsible for the deadliest form of human malaria, with a life cycle alternating between the Anopheles mosquito and the human liver and bloodstream.",
                },
              ],
            },
            {
              id: "rhizaria",
              name: "Rhizaria",
              rank: "Clade",
              blurb:
                "Mostly amoeboid, single-celled organisms that extend thin, often branching pseudopods for feeding and movement; includes forams and radiolarians.",
              children: [
                {
                  id: "foraminiferan",
                  name: "Globigerina bulloides",
                  common: "planktonic foraminiferan",
                  rank: "Species",
                  blurb:
                    "Builds a calcium carbonate shell whose chemical composition records the ocean temperature it grew in, making fossilized shells a key tool for reconstructing past climates.",
                },
              ],
            },
          ],
        },
        {
          id: "discoba",
          name: "Discoba",
          rank: "Clade",
          color: "discoba",
          time: "~1.2 bya (approximate, deep and contested branch point)",
          blurb:
            "Discoba proper contains Euglenozoa and its relatives; Metamonada is grouped here as a legacy simplification (both were historically lumped together as 'Excavata') rather than as a true Discoba member, and several of these lineages have lost mitochondria in their classic form.",
          children: [
            {
              id: "euglenozoa",
              name: "Euglenozoa",
              rank: "Clade",
              blurb:
                "Excavates with a spiral or crystalline rod supporting the flagellum; includes both photosynthetic and parasitic lineages.",
              children: [
                {
                  id: "euglena",
                  name: "Euglena gracilis",
                  rank: "Species",
                  blurb:
                    "Photosynthesizes like a plant via a chloroplast acquired from ingesting a green alga, yet swims and hunts like an animal when light is scarce.",
                },
                {
                  id: "t-brucei",
                  name: "Trypanosoma brucei",
                  rank: "Species",
                  blurb:
                    "Transmitted by the tsetse fly, this parasite causes African sleeping sickness and evades the immune system by cycling through hundreds of different surface coat proteins.",
                },
              ],
            },
            {
              id: "metamonada",
              name: "Metamonada",
              rank: "Clade",
              blurb:
                "Anaerobic excavates that lack conventional mitochondria entirely, carrying only stripped-down remnant organelles called mitosomes.",
              children: [
                {
                  id: "giardia",
                  name: "Giardia lamblia",
                  rank: "Species",
                  blurb:
                    "A common cause of waterborne diarrheal illness; it has two nuclei per cell and was long mistakenly thought to be one of the most 'primitive' eukaryotes for seeming to lack mitochondria.",
                },
              ],
            },
          ],
        },
      ],
    },
      ],
    },
      ],
    },
      ],
    },
  ],
},
  ],
};

export const clades: CladeMeta[] = [
  { id: "bacteria", label: "Bacteria", rootId: "bacteria" },
  { id: "archaea", label: "Archaea", rootId: "archaea" },
  { id: "animalia", label: "Animalia", rootId: "animalia" },
  { id: "fungi", label: "Fungi", rootId: "fungi" },
  { id: "archaeplastida", label: "Archaeplastida", rootId: "archaeplastida" },
  { id: "sar", label: "SAR", rootId: "sar" },
  { id: "discoba", label: "Discoba", rootId: "discoba" },
  { id: "amoebozoa", label: "Amoebozoa", rootId: "amoebozoa" },
];
