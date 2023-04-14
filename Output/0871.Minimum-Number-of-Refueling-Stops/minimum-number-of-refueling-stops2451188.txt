// https://leetcode.com/problems/minimum-number-of-refueling-stops/solutions/2451188/rust-with-max-heap/
use std::collections::BinaryHeap;

impl Solution {
    pub fn min_refuel_stops(target: i32, start_fuel: i32, stations: Vec<Vec<i32>>) -> i32 {
        let mut fuel = 0;
        let mut heap = BinaryHeap::from([start_fuel]);
        let mut ans = -1;
        let mut i = 0;
        while !heap.is_empty() {
            ans += 1;
            fuel += heap.pop().unwrap();
            if fuel >= target {
                return ans;
            }
            while i < stations.len() && stations[i][0] <= fuel {
                heap.push(stations[i][1]);
                i += 1;
            }
        }
        -1
    }
}