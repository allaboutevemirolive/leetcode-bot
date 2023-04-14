// https://leetcode.com/problems/minimum-number-of-refueling-stops/solutions/2453709/rust-priority-queue-functional-style-with-comments/
use std::collections::BinaryHeap;

impl Solution {
    pub fn min_refuel_stops(target: i32, start_fuel: i32, stations: Vec<Vec<i32>>) -> i32 {
        stations
            .into_iter()
            .map(|station| (station[1], station[0]))
            .chain(std::iter::once((0, target)))
            .scan(
                (start_fuel, BinaryHeap::<i32>::new(), 0),
                |(total_fuel, pq, stops), (fuel, pos)| {
                    if *total_fuel == -1 {
                        None
                    } else {
                        while pos > *total_fuel {
                            match pq.pop() {
                                None => {
                                    *total_fuel = -1;
                                    return Some(-1);
                                }
                                Some(max_fuel) => {
                                    *total_fuel += max_fuel;
                                    *stops += 1;
                                }
                            }
                        }
                        pq.push(fuel);
                        Some(*stops)
                    }
                },
            )
            .last()
            .unwrap()
    }
}