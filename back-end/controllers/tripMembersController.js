const { supabase } = require("../db/supabase");

/* ─────────────────────────────────────────────────────────── */
/*  GET /api/auth/tripMembers/:trip_id                         */
/*  Only the trip creator can see all join requests             */
/* ─────────────────────────────────────────────────────────── */
exports.getTripMembers = async (req, res) => {
  try {
    const { trip_id } = req.params;

    // Verify the requesting user is the trip creator
    const { data: trip, error: tripErr } = await supabase
      .from("trips")
      .select("id, created_by")
      .eq("id", trip_id)
      .maybeSingle();

    if (tripErr) return res.status(500).json({ message: tripErr.message });
    if (!trip)   return res.status(404).json({ message: "Trip not found" });
    if (trip.created_by !== req.user.id)
      return res.status(403).json({ message: "Not authorised: you did not create this trip" });

    const { data: members, error: membersErr } = await supabase
      .from("trip_members")
      .select("id, name, age, gender, contact, status, created_at, user_id")
      .eq("trip_id", trip_id)
      .order("created_at", { ascending: true });

    if (membersErr) return res.status(500).json({ message: membersErr.message });

    return res.status(200).json({ members: members || [] });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

/* ─────────────────────────────────────────────────────────── */
/*  PATCH /api/auth/tripMembers/:member_id/status              */
/*  Body: { status: "approved" | "rejected" }                  */
/*  Only the trip creator can approve/reject                    */
/* ─────────────────────────────────────────────────────────── */
exports.updateMemberStatus = async (req, res) => {
  try {
    const { member_id } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status))
      return res.status(400).json({ message: "status must be 'approved' or 'rejected'" });

    // Fetch the membership and its trip to verify ownership
    const { data: member, error: memberErr } = await supabase
      .from("trip_members")
      .select("id, trip_id, status")
      .eq("id", member_id)
      .maybeSingle();

    if (memberErr) return res.status(500).json({ message: memberErr.message });
    if (!member)   return res.status(404).json({ message: "Member record not found" });

    const { data: trip, error: tripErr } = await supabase
      .from("trips")
      .select("created_by")
      .eq("id", member.trip_id)
      .maybeSingle();

    if (tripErr) return res.status(500).json({ message: tripErr.message });
    if (!trip)   return res.status(404).json({ message: "Trip not found" });
    if (trip.created_by !== req.user.id)
      return res.status(403).json({ message: "Not authorised" });

    const { error: updateErr } = await supabase
      .from("trip_members")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", member_id);

    if (updateErr) return res.status(500).json({ message: updateErr.message });

    return res.status(200).json({ message: `Request ${status} successfully` });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};
