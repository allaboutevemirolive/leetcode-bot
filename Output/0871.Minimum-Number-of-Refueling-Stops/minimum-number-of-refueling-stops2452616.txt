// https://leetcode.com/problems/minimum-number-of-refueling-stops/solutions/2452616/rust-fastest-0ms-binaryheap/
use std::collections::BinaryHeap;

impl Solution {
    pub fn min_refuel_stops(target: i32, mut start_fuel: i32, mut stations: Vec<Vec<i32>>) -> i32 {
        let mut capacities = BinaryHeap::new();
        let mut refuels = 0;
        let mut prev = 0;
        
        stations.push(vec![target, std::i32::MAX]);
        for i in 0..stations.len() {
            let (pos, fuel) = (stations[i][0], stations[i][1]);
            let need = pos - prev;
            start_fuel -= need;
            // going back to previous stations to get more fuel
            while !capacities.is_empty() && start_fuel < 0 {
                start_fuel += capacities.pop().unwrap();
                refuels += 1;
            }
            
            if start_fuel < 0 {
                return -1;
            }
            // remembering how much gas each station had
            capacities.push(fuel);
            prev = pos;
        }
        refuels
    }
}