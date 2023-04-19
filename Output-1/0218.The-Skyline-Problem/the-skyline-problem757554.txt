// https://leetcode.com/problems/the-skyline-problem/solutions/757554/rust-o-nlogn-time-o-n-space/
use std::collections::BinaryHeap;

impl Solution {
    pub fn get_skyline(buildings: Vec<Vec<i32>>) -> Vec<Vec<i32>> {
        let mut q = BinaryHeap::<(i32 /*height*/, i32 /*building id*/)>::with_capacity(buildings.len());
        let mut valid = vec![false; buildings.len()];
        let mut line = Vec::<(i32 /*coordinate*/, i32 /*building id*/, bool /*is start point?*/, i32 /*height*/)>::with_capacity(2*buildings.len());
        let mut result = Vec::<Vec<i32>>::new();
        
        for (i, data) in buildings.iter().enumerate() {
            line.push((data[0], i as i32, true, data[2]));
            line.push((data[1], i as i32, false, data[2]));
        }
		// Sort by coordinate, untie by larger height
        line.sort_unstable_by_key(|x| (x.0, -(x.3 as i64)));
        
        for point in line {
            let coord = point.0;
            let i = point.1;
            let is_start = point.2;

            if is_start {
                let height = buildings[i as usize][2];
                valid[i as usize] = true;
                q.push((height, i));
                result.push(vec![coord, q.peek().unwrap().0]);
            } else {
                valid[i as usize] = false;
                while let Some(&(_, j)) = q.peek() {
                    if valid[j as usize] {
                        break;
                    }
                    q.pop();
                }

                result.push(vec![coord, q.peek().unwrap_or(&(0, 0)).0]);
            }
        }
        
        // Remove all entries with the same coordinate but one (keep the one that appears last in the list)
        let mut last_coord = -1;
        result = result.into_iter().rev().filter(|x| {
            if x[0] != last_coord {
                last_coord = x[0];
                return true;
            }
            return false;
        }).collect::<Vec<Vec<i32>>>();
        // Remove all entries with the same height but one (keep the one that appears first in the list)
        let mut h = -1;
        result = result.into_iter().rev().filter(|x| {
            if x[1] != h {
                h = x[1];
                return true;
            }
            return false;
        }).collect();
        
        result
    }
}