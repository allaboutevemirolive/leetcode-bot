// https://leetcode.com/problems/minimum-number-of-refueling-stops/solutions/2451235/rust-binaryheap-going-back-for-more/
use std::collections::BinaryHeap;

impl Solution {
    pub fn min_refuel_stops(target: i32, start_fuel: i32, stations: Vec<Vec<i32>>) -> i32 {
        // max heap of station fuel values that we have already driven past
        let mut skipped: BinaryHeap<i32> = BinaryHeap::new();
        let mut tank = start_fuel;
        let mut out = 0;
        for station in stations {
            let pos = station[0];
            let gas = station[1];
            while pos > tank {
                // While insufficient fuel, greedily go back for the largest stations first.
                if let Some(fuel_source) = skipped.pop() {
                    tank += fuel_source;
                    out += 1;
                } else {
                    return -1;  // ran out early
                }
            }
            skipped.push(gas);
        }
		// Final stretch from last station to `target`:
        // If only BinaryHeap::into_iter_sorted was out of nightly.
        // Then, we could iterate until tank+acc > target or else -1.
        while target > tank {
            if let Some(fuel_source) = skipped.pop() {
                tank += fuel_source;
                out += 1;
            } else { return -1; }
        }
        out
    }
}