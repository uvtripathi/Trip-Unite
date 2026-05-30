const { supabase } = require("../db/supabase");

exports.allTrips = async (req, res) => {
  try {
    // Join trips with users to get creator's full name
    const { data: trips, error } = await supabase
      .from("trips")
      .select(`
        *,
        users:created_by ( full_name )
      `);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const mappedTrips = (trips || []).map((trip) => ({
      _id: trip.id,
      Name: trip.name,
      Destination: trip.destination,
      Description: trip.description,
      StartDate: trip.start_date,
      EndDate: trip.end_date,
      estimatedBudget: trip.estimated_budget,
      TravellerCount: trip.traveller_count,
      localGuide: trip.local_guide,
      MeetUPLocation: trip.meetup_location,
      Gender: trip.gender,
      MinAge: trip.min_age,
      MaxAge: trip.max_age,
      Remark: trip.remark,
      createdBy: trip.users?.full_name || "Anonymous", // ← real name now
    }));

    return res.status(200).json({ trips: mappedTrips });
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
};
