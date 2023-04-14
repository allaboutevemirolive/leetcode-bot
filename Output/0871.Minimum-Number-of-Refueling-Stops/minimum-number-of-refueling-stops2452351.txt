// https://leetcode.com/problems/minimum-number-of-refueling-stops/solutions/2452351/rust-heap-solution/
use std::collections::BinaryHeap;

impl Solution {
    pub fn min_refuel_stops(target: i32, start_fuel: i32, mut stations: Vec<Vec<i32>>) -> i32 {       
        stations.push(vec![target, 0]);
        
        let mut min_number_of_stops = 0i32;
        let mut heap = BinaryHeap::with_capacity(stations.len());
        
        let mut current_fuel = start_fuel;
        
        for station in stations {
            let (position, fuel) = (station[0], station[1]);
            
            // if there is not enough fuel to keep going, then try to refuel from the biggest stations we have seen before
            while current_fuel < position {
                if let Some(refuel) = heap.pop() {
                    current_fuel += refuel;
                    min_number_of_stops += 1;
                } else {
                    // not enough fuel
                    return -1;
                }
            }
            // memorizing stations to refuel later if needed
            heap.push(fuel);
        }
        
        return min_number_of_stops;
    }
}