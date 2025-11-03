import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PharmacyLink {
  id: string;
  product_url: string;
  pharmacy_name: string;
  medication_name: string;
  regular_price: number | null;
  sale_price: number | null;
}

interface PriceResult {
  regularPrice: number | null;
  salePrice: number | null;
}

// Function to extract prices from Dr. Simi
async function scrapeDrSimi(url: string): Promise<PriceResult> {
  try {
    const response = await fetch(url);
    const html = await response.text();
    
    // Extract prices from HTML - Dr. Simi structure
    // Regular price pattern: <span>$X,XXX</span> (first occurrence)
    // Sale price pattern: <span>$X,XXX</span> (second occurrence, usually lower)
    
    const priceMatches = html.match(/\$[\d,]+/g);
    
    if (!priceMatches || priceMatches.length === 0) {
      console.log(`No prices found for ${url}`);
      return { regularPrice: null, salePrice: null };
    }
    
    // Convert price strings to numbers (remove $ and commas)
    const prices = priceMatches
      .map(p => parseInt(p.replace(/[$,]/g, ''), 10))
      .filter(p => !isNaN(p) && p > 0);
    
    if (prices.length >= 2) {
      // Dr. Simi typically shows regular price first, then sale price
      const regularPrice = Math.max(prices[0], prices[1]);
      const salePrice = Math.min(prices[0], prices[1]);
      
      return { 
        regularPrice,
        salePrice: salePrice < regularPrice ? salePrice : null
      };
    } else if (prices.length === 1) {
      return { regularPrice: prices[0], salePrice: null };
    }
    
    return { regularPrice: null, salePrice: null };
  } catch (error) {
    console.error(`Error scraping Dr. Simi (${url}):`, error);
    return { regularPrice: null, salePrice: null };
  }
}

// Function to extract prices from Farmacias Ahumada
async function scrapeAhumada(url: string): Promise<PriceResult> {
  try {
    const response = await fetch(url);
    const html = await response.text();
    
    const priceMatches = html.match(/\$[\d,]+/g);
    
    if (!priceMatches || priceMatches.length === 0) {
      return { regularPrice: null, salePrice: null };
    }
    
    const prices = priceMatches
      .map(p => parseInt(p.replace(/[$,]/g, ''), 10))
      .filter(p => !isNaN(p) && p > 0);
    
    if (prices.length === 0) {
      return { regularPrice: null, salePrice: null };
    }
    
    // For Ahumada, use the last price as sale price (usually the lowest shown)
    const salePrice = prices[prices.length - 1];
    const regularPrice = prices.find(p => p > salePrice) || salePrice;
    
    return { 
      regularPrice,
      salePrice: salePrice < regularPrice ? salePrice : null
    };
  } catch (error) {
    console.error(`Error scraping Ahumada (${url}):`, error);
    return { regularPrice: null, salePrice: null };
  }
}

// Function to extract prices from Cruz Verde
async function scrapeCruzVerde(url: string): Promise<PriceResult> {
  try {
    const response = await fetch(url);
    const html = await response.text();
    
    const priceMatches = html.match(/\$\s*[\d,]+/g);
    
    if (!priceMatches || priceMatches.length === 0) {
      return { regularPrice: null, salePrice: null };
    }
    
    const prices = priceMatches
      .map(p => parseInt(p.replace(/[$,\s]/g, ''), 10))
      .filter(p => !isNaN(p) && p > 0);
    
    if (prices.length === 0) {
      return { regularPrice: null, salePrice: null };
    }
    
    // For Cruz Verde, get the lowest price as sale price (best deal)
    const salePrice = Math.min(...prices);
    const regularPrice = Math.max(...prices);
    
    return { 
      regularPrice,
      salePrice: salePrice < regularPrice ? salePrice : null
    };
  } catch (error) {
    console.error(`Error scraping Cruz Verde (${url}):`, error);
    return { regularPrice: null, salePrice: null };
  }
}

// Function to extract prices from Salcobrand
async function scrapeSalcobrand(url: string): Promise<PriceResult> {
  try {
    const response = await fetch(url);
    const html = await response.text();
    
    const priceMatches = html.match(/\$[\d,]+/g);
    
    if (!priceMatches || priceMatches.length === 0) {
      return { regularPrice: null, salePrice: null };
    }
    
    const prices = priceMatches
      .map(p => parseInt(p.replace(/[$,]/g, ''), 10))
      .filter(p => !isNaN(p) && p > 0);
    
    if (prices.length === 0) {
      return { regularPrice: null, salePrice: null };
    }
    
    // Use the lowest price as sale price
    const salePrice = Math.min(...prices);
    const regularPrice = prices.find(p => p > salePrice) || salePrice;
    
    return { 
      regularPrice,
      salePrice: salePrice < regularPrice ? salePrice : null
    };
  } catch (error) {
    console.error(`Error scraping Salcobrand (${url}):`, error);
    return { regularPrice: null, salePrice: null };
  }
}

// Main scraping function
async function scrapePharmacyPrice(link: PharmacyLink): Promise<PriceResult> {
  const url = link.product_url.toLowerCase();
  const pharmacy = link.pharmacy_name.toLowerCase();
  
  console.log(`Scraping ${pharmacy} - ${link.medication_name}: ${link.product_url}`);
  
  if (pharmacy.includes('simi') || url.includes('drsimi.cl')) {
    return await scrapeDrSimi(link.product_url);
  } else if (pharmacy.includes('ahumada') || url.includes('farmaciasahumada.cl')) {
    return await scrapeAhumada(link.product_url);
  } else if (pharmacy.includes('cruz verde') || url.includes('cruzverde.cl')) {
    return await scrapeCruzVerde(link.product_url);
  } else if (pharmacy.includes('salcobrand') || url.includes('salcobrand.cl')) {
    return await scrapeSalcobrand(link.product_url);
  }
  
  console.log(`Unknown pharmacy: ${pharmacy}`);
  return { regularPrice: null, salePrice: null };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Starting pharmacy price update...');

    // Fetch all active pharmacy links
    const { data: links, error: fetchError } = await supabase
      .from('pharmacy_links')
      .select('id, product_url, pharmacy_name, medication_name, regular_price, sale_price')
      .eq('is_active', true);

    if (fetchError) {
      throw fetchError;
    }

    if (!links || links.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No active pharmacy links to update' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${links.length} links to update`);

    const results = {
      total: links.length,
      updated: 0,
      failed: 0,
      unchanged: 0,
    };

    // Update prices for each link
    for (const link of links) {
      try {
        const priceResult = await scrapePharmacyPrice(link as PharmacyLink);
        
        if (priceResult.regularPrice === null) {
          console.log(`No price found for ${link.pharmacy_name} - ${link.medication_name}`);
          results.failed++;
          continue;
        }

        // Check if prices changed
        const pricesChanged = 
          priceResult.regularPrice !== link.regular_price ||
          priceResult.salePrice !== link.sale_price;

        if (pricesChanged) {
          const { error: updateError } = await supabase
            .from('pharmacy_links')
            .update({
              regular_price: priceResult.regularPrice,
              sale_price: priceResult.salePrice,
            })
            .eq('id', link.id);

          if (updateError) {
            console.error(`Error updating ${link.id}:`, updateError);
            results.failed++;
          } else {
            console.log(`Updated ${link.pharmacy_name} - ${link.medication_name}: Regular $${priceResult.regularPrice}, Sale $${priceResult.salePrice}`);
            results.updated++;
          }
        } else {
          console.log(`Prices unchanged for ${link.pharmacy_name} - ${link.medication_name}`);
          results.unchanged++;
        }

        // Add small delay to avoid overwhelming servers
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Error processing link ${link.id}:`, error);
        results.failed++;
      }
    }

    console.log('Price update completed:', results);

    return new Response(
      JSON.stringify({
        message: 'Price update completed',
        results,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in update-pharmacy-prices function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
