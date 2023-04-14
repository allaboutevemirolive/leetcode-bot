// https://leetcode.com/problems/minimum-number-of-refueling-stops/solutions/1268391/rust-binaryheap-solution/
use std::collections::BinaryHeap;

impl Solution {
    pub fn min_refuel_stops(target: i32, start_fuel: i32, mut stations: Vec<Vec<i32>>) -> i32 {
        
        if target <= start_fuel { return 0; } // no stops needed
        if stations.is_empty() { return -1; } // no stations when needed
        
        let mut heap = BinaryHeap::with_capacity(stations.len());
        let (mut tank, mut count) = (start_fuel, 0); // tank is more like "accumulative max travel distance"
        
        stations.push(vec![target, 0]); // to count for the last stretch
        
        for s in stations {
            while tank < s[0] {
                match heap.pop() {
                    Some(add) => { tank += add; count += 1; }
                    None => return -1, // no more fuel
                }
            }
            
            heap.push(s[1]);
            if tank >= target { break; } // make a run for it
        }
        
        count
    }
}