// https://leetcode.com/problems/bus-routes/solutions/3353405/rust-0-1-bfs/

use std::collections::{HashMap, VecDeque};

const NO_ROUTE_FOUND: i32 = -1;

pub fn num_buses_to_destination(routes: Vec<Vec<i32>>, source: i32, target: i32) -> i32 {
    if source == target {
        return 0;
    }

    // assign consecutive IDs/numbers to the stops
    let mut stop_ids = HashMap::new();
    for route in routes.iter().chain([vec![source, target]].iter()) {
        for stop_key in route.iter().copied() {
            let id = stop_ids.len();
            stop_ids.entry(stop_key).or_insert(id);
        }
    }

    // group the busses by the stops they visit
    let mut busses_by_stop = vec![vec![]; stop_ids.len()];
    for (bus, route) in routes.iter().enumerate() {
        for stop_key in route.iter() {
            let stop_id = stop_ids[stop_key];
            busses_by_stop[stop_id].push(bus);
        }
    }

    let start_from = stop_ids[&source];
    let end_at = stop_ids[&target];

    let mut visited = vec![i32::MAX; routes.len()];
    let mut queue = VecDeque::new();
    for bus in busses_by_stop[start_from].iter().copied() {
        queue.push_front((1, bus, start_from));
    }

    while let Some((cost, current_route, current_stop)) = queue.pop_front() {
        if current_stop == end_at {
            return cost;
        }

        for next_route in busses_by_stop[current_stop].iter().copied() {
            let next_cost = cost + (next_route != current_route) as i32;
            if visited[next_route] <= next_cost {
                // do not revisit routes if this will not improve the cost (i.e. the number of busses used)
                continue;
            }
            visited[next_route] = next_cost;

            for next_stop_key in routes[next_route].iter() {
                let next_stop = stop_ids[next_stop_key];

                if next_route == current_route {
                    queue.push_front((next_cost, next_route, next_stop));
                } else {
                    queue.push_back((next_cost, next_route, next_stop));
                }
            }
        }
    }

    NO_ROUTE_FOUND
}