// https://leetcode.com/problems/frog-jump/solutions/1779553/a-rust-iteration-solution-with-comments/
impl Solution {
    pub fn can_cross(stones: Vec<i32>) -> bool {
        if stones[1] != 1 {
            return false;
        }
        
        let mut jump_from_stones: Vec<Option<usize>> = vec![None; stones.len()];
        jump_from_stones[1] = Some(0);
        let mut jump_to_stones: Vec<Option<usize>> = vec![None; stones.len()];
        jump_to_stones[0] = Some(1);
        let mut curr_idx = 1;
        let mut last_jump_distance = 1;
        
        'main_loop: loop {
            // frog in already on the last stone!
            if curr_idx + 1 == stones.len() {
                return true;
            }
            // move forward case
            for next_stone_idx in (jump_to_stones[curr_idx].unwrap_or(curr_idx) + 1)..stones.len() {
                if let Some(next_jump_from) = jump_from_stones[next_stone_idx] {
                    if next_jump_from == curr_idx {
                        // the path is already been taken, skip
                        continue
                    }
                }
                let next_jump_distance = stones[next_stone_idx] - stones[curr_idx];
                // not possible to move forward
                if next_jump_distance > last_jump_distance + 1 {
                    break;
                }
                // expecting to jump further
                if next_jump_distance < last_jump_distance - 1 {
                    continue
                }
                // now we found the next jump that haven't been explored
                jump_from_stones[next_stone_idx] = Some(curr_idx);
                jump_to_stones[curr_idx] = Some(next_stone_idx);
                curr_idx = next_stone_idx;
                last_jump_distance = next_jump_distance;
                continue 'main_loop;
            }
            // back track case
            if let Some(prev_idx) = jump_from_stones[curr_idx] {
                if let Some(prev_jump_from) =  jump_from_stones[prev_idx] {
                    // println!("from {} backtrack to {}", curr_idx, prev_idx);
                    curr_idx = prev_idx;
                    last_jump_distance = stones[prev_idx] - stones[prev_jump_from];
                    continue 'main_loop;
                }
            }
            // exhaust case
            break
        }
        false
    }
}