// https://leetcode.com/problems/reaching-points/solutions/391867/rust-0ms-2-3-mb/
impl Solution {
    pub fn reaching_points(sx: i32, sy: i32, tx: i32, ty: i32) -> bool {
        let mut break_flag = false;
        let (mut x, mut y) = (tx, ty);
        
        // edge cases
        if y == sy {
            let diff = (x - sx);
            if diff >= 0 &&diff % sy == 0 {
                return true
            } else {
                return false
            }
        } else if x == sx {
            let diff = y-sy;
            if diff >= 0 && diff % sx == 0 {
                return true
            } else {
                return false
            }
        }
        
        loop {
            if x == sx && y == sy {
                return true
            } else if x < sx || y < sy {
                return false
            } else if x > y {
                x = x-y;
            } else if x < y {
                y = y-x;
            } else if x == y {
                return false
            } else {
                break;
            }
        }
        
        return false
    }
}