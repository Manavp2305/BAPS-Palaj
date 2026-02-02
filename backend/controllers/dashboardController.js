const Member = require('../models/Member');
const Attendance = require('../models/Attendance');

// @desc    Get Dashboard Statistics
// @route   GET /api/dashboard
// @access  Private
const getDashboardStats = async (req, res) => {
    try {
        // 1. Total Members
        const totalMembers = await Member.countDocuments({ active: true });

        // 2. Attendance Trends (Last 4 entries/weeks for line chart)
        const recentAttendance = await Attendance.find({})
            .sort({ date: -1 })
            .limit(4)
            .lean(); // returns POJO

        // Format for Line Chart: "DD/MM" -> Present Count
        const trendData = recentAttendance.map(att => {
            const presentCount = att.records.filter(r => r.status === 'Present').length;
            const absentCount = att.records.filter(r => r.status === 'Absent').length;
            return {
                date: new Date(att.date).toLocaleDateString(),
                Present: presentCount,
                Absent: absentCount,
                Total: presentCount + absentCount,
                percentage: (presentCount / (presentCount + absentCount || 1)) * 100
            };
        }).reverse();

        // 3. Monthly Attendance % (Bar Chart)
        // Group by Month? For now, we can use the trend data if strictly weekly/monthly.
        // Let's get 'Top Members' instead for "Best Member"
        
        // This is expensive: we need to find all attendance records and count per member.
        // For scalability, this should be an aggregation pipeline.
        
        const topMembersPipeline = [
            { $unwind: "$records" },
            { $match: { "records.status": "Present" } },
            { $group: { _id: "$records.memberId", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
            { 
                $lookup: {
                    from: "members",
                    localField: "_id",
                    foreignField: "_id",
                    as: "memberDetails"
                }
            },
            { $unwind: "$memberDetails" },
            {
                $project: {
                    name: "$memberDetails.name",
                    count: 1
                }
            }
        ];

        const topMembers = await Attendance.aggregate(topMembersPipeline);

        // 4. Today's (or latest) Attendance Summary (Pie Chart)
        const latestInfo = trendData.length > 0 ? trendData[trendData.length - 1] : null;

        res.json({
            totalMembers,
            trendData,
            topMembers,
            latestInfo
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getDashboardStats };
