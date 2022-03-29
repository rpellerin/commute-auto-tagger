import { useEffect, useState } from "react";
import { toggleCommuteMark } from "./services/activity";
import { ActivityEnhanced } from "./services/types/activity";
import { Activity } from "./services/types/activity";

const CommuteTagAndAction = ({ activity, accessToken, onEditActivity, setNonCommuteActivities, nonCommuteActivities }: { activity: ActivityEnhanced, accessToken: string, onEditActivity: Function, setNonCommuteActivities: Function, nonCommuteActivities: string[] }) => {
    const [actionMarkCommuteButtonDisabled, setActionMArkCommuteButtonDisabled] = useState(false);
    const [actionMarkNotACommuteButtonDisabled, setActionMarkNotACommuteButtonDisabled] = useState(!activity.potentialCommute);

    const isActivityAPotentialCommute = () => {
        return activity.potentialCommute && !nonCommuteActivities.find(activityId => activityId === activity.id)
    }

    const children = activity.commute
        ? "Marked as commute "
        : activity.potentialCommute
            ? "POTENTIAL COMMUTE"
            : null;

    return (
        <>
            {children && (
                <div
                    className={`commute-tag ${activity.potentialCommute ? "potential-commute" : ""
                        }`}
                >
                    {children}
                </div>
            )}
            <div>
                <button
                    disabled={actionMarkCommuteButtonDisabled}
                    onClick={() => {
                        setActionMArkCommuteButtonDisabled(true);
                        toggleCommuteMark({ activity, accessToken }).then((activity) => {
                            setActionMArkCommuteButtonDisabled(false);
                            onEditActivity({ commute: activity.commute });
                        });
                    }}
                >
                    {activity.commute ? "Unmark" : "Mark"} as commute ride
                </button>
                {isActivityAPotentialCommute() && (
                    <button disabled={actionMarkNotACommuteButtonDisabled}
                        onClick={() => {
                            setActionMarkNotACommuteButtonDisabled(true);
                            setNonCommuteActivities((oldNonCommuteActivitiesIds: string[]) => [...oldNonCommuteActivitiesIds, activity.id]);
                        }}>
                        It's not a commute!
                    </button>
                )}
            </div>
        </>
    );
};

export default CommuteTagAndAction;