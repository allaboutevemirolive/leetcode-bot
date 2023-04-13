// https://leetcode.com/problems/dungeon-game/solutions/2819038/rust-dp-bottom-up/
impl Solution {
    pub fn calculate_minimum_hp(dungeon: Vec<Vec<i32>>) -> i32 {
        // backward propergation
        let rows = dungeon.len();
        let len = dungeon[0].len();
        let mut buf = vec![0; len];
        for (i, row) in dungeon.iter().enumerate().rev() {
            for (j, val) in row.iter().enumerate().rev() {
                if i==rows-1 {
                    buf[j] = if j==len-1 || buf[j+1]>0 {
                        *val
                    } else {
                        buf[j+1] + val
                    };
                } else {
                    buf[j] = if j==len-1 {
                        if buf[j]>0 {
                            *val
                        } else {
                            buf[j] + val
                        }
                    } else {
                        if buf[j]>0 || buf[j+1]>0 {
                            *val
                        } else {
                            (buf[j] + val).max(buf[j+1] + val)
                        }
                    }
                }
            }
        }   
        if buf[0].is_negative() {
            buf[0]*-1 + 1
        } else {
            1
        }
    }
}