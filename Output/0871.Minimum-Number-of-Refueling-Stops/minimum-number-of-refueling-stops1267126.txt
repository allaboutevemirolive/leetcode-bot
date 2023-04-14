// https://leetcode.com/problems/minimum-number-of-refueling-stops/solutions/1267126/rust-greedy-solution/
use std::collections::BinaryHeap;

impl Solution {
    pub fn min_refuel_stops(target: i32, start_fuel: i32, stations: Vec<Vec<i32>>) -> i32 {
        // Greedy solution:
        // while not able to reach target, move forward as far as it can, collect stations passby.
        // if cannot move forward anymore, try consume previous station with max fuel
        let mut pos = 0;
        let mut fuel = start_fuel;
        let mut ans = 0;
        let mut available_fuels = BinaryHeap::new();
        let mut station_idx = 0;
        while pos + fuel < target {
            pos += fuel;
            while station_idx < stations.len() && stations[station_idx][0] <= pos {
                available_fuels.push(stations[station_idx][1]);
                station_idx += 1;
            }
            fuel = match available_fuels.pop() {
                Some(a) => a,
                None => return -1
            };
            ans += 1;
        }
        ans
    }
}