const { supabase } = require("../db/supabase");

exports.joinedTrips = async (req, res) => {
  try {
    // Fetch user's memberships WITH their status
    const { data: memberships, error: membersError } = await supabase
      .from("trip_members")
      .select("trip_id, status, id, name, contact, age, gender, created_at")
      .eq("user_id", req.user.id);

    if (membersError) {
      return res.status(500).json({ message: membersError.message });
    }

    if (!memberships || !memberships.length) {
      return res.status(200).json({ trips: [] });
    }

    const tripIds = memberships.map((m) => m.trip_id);

    const { data: trips, error: tripsError } = await supabase
      .from("trips")
      .select("*")
      .in("id", tripIds);

    if (tripsError) {
      return res.status(500).json({ message: tripsError.message });
    }

    // Merge trip data with membership status
    const mappedTrips = (trips || []).map((trip) => {
      const membership = memberships.find((m) => m.trip_id === trip.id);
      return {
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
        createdBy: trip.created_by,
        // ── Join request details ──
        membershipId: membership?.id,
        joinStatus: membership?.status || "pending",
        joinedAt: membership?.created_at,
      };
    });

    return res.status(200).json({ trips: mappedTrips });
  } catch (error) {
    return res.status(500).json({ message: "error fetching joined trips" });
  }
};
