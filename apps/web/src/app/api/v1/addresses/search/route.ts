export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import httpStatus from "http-status";

/**
 * POST /api/v1/addresses/search
 * Search addresses using external geocoding service
 * 
 * Options:
 * 1. Google Places API (recommended, requires API key)
 * 2. Nominatim (OpenStreetMap, free but rate-limited)
 * 3. Mapbox Geocoding API
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, country = "US" } = body;

    if (!query || query.trim().length < 3) {
      return NextResponse.json(
        { message: "Query must be at least 3 characters" },
        { status: httpStatus.BAD_REQUEST }
      );
    }

    // Option 1: Use Google Places API (recommended)
    const googleApiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (googleApiKey) {
      return await searchWithGooglePlaces(query, country, googleApiKey);
    }

    // Option 2: Fallback to Nominatim (OpenStreetMap) - Free
    return await searchWithNominatim(query, country);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to search addresses";

    return NextResponse.json(
      { message },
      { status: httpStatus.INTERNAL_SERVER_ERROR }
    );
  }
}

/**
 * Search using Google Places API (Autocomplete)
 * Requires: GOOGLE_PLACES_API_KEY in environment variables
 */
async function searchWithGooglePlaces(
  query: string,
  country: string,
  apiKey: string
) {
  const url = new URL("https://maps.googleapis.com/maps/api/place/autocomplete/json");
  url.searchParams.set("input", query);
  url.searchParams.set("components", `country:${country}`);
  url.searchParams.set("key", apiKey);
  url.searchParams.set("types", "address");

  const response = await fetch(url.toString());
  const data = await response.json();

  if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
    throw new Error(`Google Places API error: ${data.status}`);
  }

  // Get place details for each prediction
  const predictions = data.predictions || [];
  const places = await Promise.all(
    predictions.slice(0, 5).map(async (prediction: any) => {
      const detailsUrl = new URL(
        "https://maps.googleapis.com/maps/api/place/details/json"
      );
      detailsUrl.searchParams.set("place_id", prediction.place_id);
      detailsUrl.searchParams.set("fields", "address_components,formatted_address,geometry");
      detailsUrl.searchParams.set("key", apiKey);

      const detailsResponse = await fetch(detailsUrl.toString());
      const detailsData = await detailsResponse.json();

      if (detailsData.status === "OK" && detailsData.result) {
        return parseGooglePlaceDetails(detailsData.result);
      }
      return null;
    })
  );

  return NextResponse.json(
    {
      addresses: places.filter(Boolean),
    },
    { status: httpStatus.OK }
  );
}

/**
 * Parse Google Place Details to our address format
 */
function parseGooglePlaceDetails(place: any) {
  const components = place.address_components || [];
  const getComponent = (type: string) => {
    const component = components.find((c: any) => c.types.includes(type));
    return component?.long_name || "";
  };

  return {
    formattedAddress: place.formatted_address,
    street: `${getComponent("street_number")} ${getComponent("route")}`.trim(),
    city: getComponent("locality") || getComponent("administrative_area_level_2"),
    state: getComponent("administrative_area_level_1"),
    zipCode: getComponent("postal_code"),
    country: getComponent("country"),
    latitude: place.geometry?.location?.lat,
    longitude: place.geometry?.location?.lng,
  };
}

/**
 * Search using Nominatim (OpenStreetMap) - Free alternative
 * Rate limit: 1 request per second
 */
async function searchWithNominatim(query: string, country: string) {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", query);
  url.searchParams.set("format", "json");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("limit", "5");
  url.searchParams.set("countrycodes", country.toLowerCase());

  const response = await fetch(url.toString(), {
    headers: {
      "User-Agent": "Adidas E-commerce App", // Required by Nominatim
    },
  });

  const data = await response.json();

  const addresses = data.map((item: any) => ({
    formattedAddress: item.display_name,
    street: `${item.address?.house_number || ""} ${item.address?.road || ""}`.trim(),
    city:
      item.address?.city ||
      item.address?.town ||
      item.address?.village ||
      item.address?.municipality ||
      "",
    state:
      item.address?.state ||
      item.address?.region ||
      "",
    zipCode: item.address?.postcode || "",
    country: item.address?.country_code?.toUpperCase() || country,
    latitude: parseFloat(item.lat),
    longitude: parseFloat(item.lon),
  }));

  return NextResponse.json(
    {
      addresses,
    },
    { status: httpStatus.OK }
  );
}

