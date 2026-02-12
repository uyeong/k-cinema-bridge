import type { Dictionary } from "./ko";

const en: Dictionary = {
  meta: {
    title: "k-cinema-bridge",
    description: "Unified JSON API for Korean multiplex cinema data",
  },
  header: {
    subtitle: "Unified JSON API for Korean multiplex cinema data",
  },
  overview: {
    title: "Overview",
    description:
      "This API crawls box-office and upcoming-movie data from Korea's three major multiplex chains (Lotte Cinema, CGV, Megabox), enriches it with KOBIS (Korean Film Council) movie information, and serves it as unified JSON.",
    usageTitle: "Data Usage Examples",
    usageItems: [
      "Compare and recommend movies by multiplex ranking",
      "Browse and get notified about upcoming releases",
      "Search and filter movies by genre, director, or actor",
      "Analyze differences in listings across multiplexes",
    ],
    agentTitle: "Agent Instructions",
    agentItems: [
      "BASE_URL: https://uyeong.github.io/k-cinema-bridge",
      "OPENAPI_SPEC: https://uyeong.github.io/k-cinema-bridge/openapi.json",
      "All endpoints are public GET requests, no authentication required",
      "The info field can be null, so always perform a null check",
    ],
    agentCases: `## Recommending Popular Movies

When the user asks for movie recommendations or what's popular:

1. Fetch GET {BASE_URL}/api/boxoffice.json to retrieve combined box office data from all sources.
2. Identify movies that appear across multiple sources with low rank values -- lower rank means higher popularity.
3. Present the top-ranked movies with their title, rating, and genre from info.genres if available.

## Announcing Upcoming Releases

When the user asks about upcoming or soon-to-be-released movies:

1. Fetch GET {BASE_URL}/api/upcoming.json to retrieve combined upcoming movie data.
2. Filter results by releaseDate (YYYY-MM-DD) to match the user's requested time range.
3. Provide details such as genre, directors, and actors from the info field if available.

## Searching by Genre, Director, or Actor

When the user asks about a specific genre, director, or actor:

1. Fetch both GET {BASE_URL}/api/boxoffice.json and GET {BASE_URL}/api/upcoming.json.
2. Filter results using the info field:
   - Genre: match against info.genres
   - Director: match against info.directors[].name
   - Actor: match against info.actors[].name
3. Always null-check the info field before accessing nested properties.

## Filtering by Audience Rating

When the user asks for age-appropriate movies:

1. Use the rating field to filter. This field is always present and does not require the info field.
2. Known rating values (in Korean): "전체 관람가" (All ages), "12세 관람가" (12+), "15세 관람가" (15+), "청소년 관람불가" (Adults only).

## Querying a Specific Multiplex

When the user asks about a specific cinema chain:

1. Fetch GET {BASE_URL}/api/boxoffice/{source}.json or GET {BASE_URL}/api/upcoming/{source}.json.
2. Valid source values: lotte, cgv, megabox.

## Comparing Across Multiplexes

When the user asks to compare rankings between cinema chains:

1. Fetch GET {BASE_URL}/api/boxoffice.json to retrieve combined data.
2. Find movies with the same title across different sources and compare their rank values.

## Response Guidelines

- Respond in the same language the user is using.
- When presenting movie lists, include title, rank or release date, rating, and genre when available.
- If info is null for a movie, present only the base fields (title, rank, rating, posterUrl) without guessing missing details.
- When comparing across multiplexes, use a table format for clarity.`,
  },
  endpoints: {
    title: "API Endpoints",
    thMethod: "Method",
    thPath: "Path",
    thDescription: "Description",
    allBoxoffice: "Combined box office from all sources ({lotte, cgv, megabox})",
    lotteBoxoffice: "Lotte Cinema box office (BoxOfficeMovie[])",
    cgvBoxoffice: "CGV box office (BoxOfficeMovie[])",
    megaboxBoxoffice: "Megabox box office (BoxOfficeMovie[])",
    allUpcoming: "Combined upcoming movies from all sources ({lotte, cgv, megabox})",
    lotteUpcoming: "Lotte Cinema upcoming (UpcomingMovie[])",
    cgvUpcoming: "CGV upcoming (UpcomingMovie[])",
    megaboxUpcoming: "Megabox upcoming (UpcomingMovie[])",
  },
  responses: {
    title: "Response Examples",
    boxofficeSingleTitle: "Single Source Box Office (BoxOfficeMovie[])",
    boxofficeCombinedTitle: "Combined Box Office",
    upcomingSingleTitle: "Single Source Upcoming (UpcomingMovie[])",
  },
  fields: {
    title: "Field Reference",
    thField: "Field",
    thType: "Type",
    thDescription: "Description",
    boxoffice: {
      source: 'Data source ("lotte" | "cgv" | "megabox")',
      rank: "Box office rank (starting from 1)",
      title: "Movie title",
      rating: "Audience rating",
      posterUrl: "Poster image URL",
      info: "KOBIS detailed info (may be null)",
    },
    upcoming: {
      source: 'Data source ("lotte" | "cgv" | "megabox")',
      title: "Movie title",
      rating: "Audience rating",
      posterUrl: "Poster image URL",
      releaseDate: "Release date (YYYY-MM-DD, may be an empty string)",
      info: "KOBIS detailed info (may be null)",
    },
    movieInfo: {
      code: "KOBIS movie code",
      title: "Movie title (Korean)",
      englishTitle: "English title",
      originalTitle: "Original title",
      runtime: "Runtime (minutes)",
      productionYear: "Production year",
      openDate: "Release date (YYYYMMDD)",
      productionStatus: "Production status",
      type: "Movie type (feature, short, etc.)",
      nations: "Production countries",
      genres: "Genres",
      directors: "Directors",
      actors: "Cast",
      showTypes: "Screening formats (2D, IMAX, etc.)",
      companies: "Related companies (distributor, producer, etc.)",
      audits: "Certification info",
      staff: "Staff",
    },
  },
  skillSetup: {
    title: "AI Agent Skill Setup",
    description:
      "A skill file is provided so AI agents can use this API. Add the content from the URL below to your agent configuration to enable automatic Korean movie data lookup.",
    claudeCodeDesc: [
      "Register the SKILL.md content as a skill in your project's ",
      ", or add a reference to the SKILL_URL in your ",
      ".",
    ],
    openClawDesc:
      "Fetch the URL above from your agent prompt or skill configuration and include it in the context.",
  },
  supplementary: {
    title: "Additional Information",
    refreshTerm: "Data Refresh",
    refreshDesc:
      "Automatically updated daily at 00:00 UTC via GitHub Actions.",
    sourceTerm: "source Values",
    sourceDesc: [" (Lotte Cinema), ", " (CGV), ", " (Megabox)"],
    infoTerm: "info Field",
    infoDesc: [
      "Returns ",
      " when KOBIS title matching fails. Always check for null when processing responses.",
    ],
    validSourceTerm: "Valid source Values",
    validSourceDesc:
      "Only lotte, cgv, and megabox are valid. A 404 response is returned if the corresponding JSON file does not exist.",
  },
};

export default en;
