// https://leetcode.com/problems/the-skyline-problem/solutions/2342135/rust-divide-and-conquer-with-comments/
use std::cmp::Ordering;

impl Solution {
    fn daq(buildings: &[Vec<i32>]) -> Vec<Vec<i32>> {
        match buildings.len() {
            // Base case - no buildings => no skyline
            0 => vec![],
            // Base case - single building is easily transformed to skyline
            1 => {
                let building = &buildings[0];
                vec![vec![building[0], building[2]], vec![building[1], 0]]
            }
            n => {
                // Divide and conquer left and right half of buildings
                let (left_buildings, right_buildings) = buildings.split_at(n / 2);
                let (left_skyline, right_skyline) =
                    (Self::daq(left_buildings), Self::daq(right_buildings));
                // Merge skylines by iterating through child skylines (left to right) and updating the height at the nearest edge
                let mut rez = Vec::with_capacity(n);
                let mut left_it = left_skyline.into_iter().peekable();
                let mut right_it = right_skyline.into_iter().peekable();
                let (mut left_height, mut right_height, mut current_height) = (0, 0, 0);

                // Loop while there are edges left in both chunks
                while let (Some(left_event), Some(right_event)) = (left_it.peek(), right_it.peek())
                {
                    let case = left_event[0].cmp(&right_event[0]);
                    let mut x = 0;
                    // Process edge from left chunk if needed
                    if [Ordering::Less, Ordering::Equal].contains(&case) {
                        let event = left_it.next().unwrap();
                        x = event[0];
                        left_height = event[1];
                    }
                    // Process edge from right chunk if needed
                    if [Ordering::Greater, Ordering::Equal].contains(&case) {
                        let event = right_it.next().unwrap();
                        x = event[0];
                        right_height = event[1];
                    }
                    // Update current height and result if needed
                    let new_height = left_height.max(right_height);
                    if new_height != current_height {
                        current_height = new_height;
                        rez.push(vec![x, current_height]);
                    }
                }
                // Append what remains of left or right chunks
                rez.extend(left_it);
                rez.extend(right_it);
                rez
            }
        }
    }

    pub fn get_skyline(buildings: Vec<Vec<i32>>) -> Vec<Vec<i32>> {
        // Transform buildings to skyline by divide and conquer
        Self::daq(&buildings)
    }
}