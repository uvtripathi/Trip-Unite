const tripSchema = require("../authN/tripsType");
const { supabase } = require("../db/supabase");

exports.trip = async (req, res) => {
  try {
    const createPayload = req.body;

    // Validate the payload using authN (tripSchema)
    const isCorrect = tripSchema.safeParse(createPayload);
    if (!isCorrect.success) {
      console.log("Validation Error:", isCorrect.error); // Log validation errors
      return res.status(400).json({
        message: "AuthN is required and must be valid",
        error: isCorrect.error, // Return the error for debugging
      });
    }

    console.log("Payload Validated Successfully:", createPayload.Name);

    const { data: createTrip, error } = await supabase
      .from("trips")
      .insert({
        name: createPayload.Name,
        description: createPayload.Description,
        destination: createPayload.Destination,
        start_date: createPayload.StartDate,
        end_date: createPayload.EndDate,
        estimated_budget: createPayload.estimatedBudget,
        traveller_count: createPayload.TravellerCount,
        local_guide: createPayload.localGuide,
        meetup_location: createPayload.MeetUPLocation,
        gender: createPayload.Gender,
        min_age: createPayload.MinAge,
        max_age: createPayload.MaxAge,
        remark: createPayload.Remark,
        created_by: req.user.id,
      })
      .select("*")
      .single();

    if (error) {
      return res.status(500).json({
        msg: "Trip creation failed",
        error: error.message,
      });
    }

    if (!createTrip) {
      return res.status(402).json({
        msg: "False input",
      });
    }

    // Successful trip creation response
    return res.status(200).json({
      msg: "Trip created successfully",
      trip: {
        _id: createTrip.id,
        Name: createTrip.name,
        Description: createTrip.description,
        Destination: createTrip.destination,
        StartDate: createTrip.start_date,
        EndDate: createTrip.end_date,
        estimatedBudget: createTrip.estimated_budget,
        TravellerCount: createTrip.traveller_count,
        localGuide: createTrip.local_guide,
        MeetUPLocation: createTrip.meetup_location,
        Gender: createTrip.gender,
        MinAge: createTrip.min_age,
        MaxAge: createTrip.max_age,
        Remark: createTrip.remark,
        createdBy: createTrip.created_by,
      },
    });
  } catch (error) {
    console.error("Error creating trip:", error);
    return res.status(500).json({
      msg: "Internal Server Error",
      error: error.message || "Something went wrong",
    });
  }
};
