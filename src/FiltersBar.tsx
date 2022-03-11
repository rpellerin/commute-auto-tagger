import { useEffect, useRef, useState } from "react";
import { ActivityEnhanced } from "./services/types/activity";

type Filters = {
    "Potential commute"?: Function
    Commute?: Function
    "Non commute"?: Function
}

const filters: Filters = {
    "Potential commute": (activity: ActivityEnhanced) => activity.potentialCommute,
    Commute: (activity: ActivityEnhanced) => activity.commute,
    "Non commute": (activity: ActivityEnhanced) => !activity.commute,
};

const checkedFiltersFromLocalStorage =
    window.localStorage.getItem("checkedFilters");
const defaultFiltersState = checkedFiltersFromLocalStorage
    ? JSON.parse(checkedFiltersFromLocalStorage).reduce(
        (acc: Object, filterName: string) => ({ ...acc, [filterName]: (filters as any)[filterName] }),
        {}
    )
    : filters;

const FiltersBar = ({
    children,
    activities,
    loadNextPage,
    stopInfiniteScroll,
    loading,
}: { children: any, activities: ActivityEnhanced[], loadNextPage: Function, stopInfiniteScroll: boolean, loading: boolean }) => {
    const [checkedFilters, setCheckeFilters] = useState(defaultFiltersState);
    const bottomDiv = useRef();
    useEffect(() => {
        if (stopInfiniteScroll || activities.length === 0) return () => null;
        let observer: any;

        let options = {
            threshold: 1.0,
        };

        const callback = (entries: IntersectionObserverEntry[]) => {
            const entry = entries[0];
            if (entry.isIntersecting) {
                loadNextPage();
            }
        };

        observer = new IntersectionObserver(callback, options);
        observer.observe(bottomDiv.current);
        return () => observer.disconnect();
    }, [checkedFilters, activities, loadNextPage, stopInfiniteScroll]);

    useEffect(() => {
        window.localStorage.setItem(
            "checkedFilters",
            JSON.stringify(Object.keys(checkedFilters))
        );
    }, [checkedFilters]);

    return (
        <>
            <div id="filters">
                {Object.entries(filters).map(([labelString, fn]) => (
                    <label key={labelString}>
                        {`${labelString} `}
                        <input
                            type="checkbox"
                            checked={!!checkedFilters[labelString]}
                            onChange={() =>
                                setCheckeFilters((checkedFilters: any) => {
                                    const newCheckedFilters = { ...checkedFilters };
                                    if (checkedFilters[labelString])
                                        delete newCheckedFilters[labelString];
                                    else newCheckedFilters[labelString] = fn;
                                    return newCheckedFilters;
                                })
                            }
                        />
                    </label>
                ))}
            </div>
            {children(
                activities.filter((activity) =>
                    Object.values(checkedFilters).reduce(
                        (acc: boolean, fn: any) => acc || fn(activity),
                        false
                    )
                )
            )}
            <div ref={bottomDiv as any}>
                {loading ? "Loading..." : "No more activities to display"}
            </div>
        </>
    );
};

export default FiltersBar;