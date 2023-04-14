// https://leetcode.com/problems/orderly-queue/solutions/2784272/rust-100-performance/
impl Solution {
    pub fn orderly_queue(s: String, k: i32) -> String {
        if k as usize > 1 {
            let mut s: Vec<u8> = s.chars().map(|c| c as u8).collect::<Vec<_>>();
            s.sort_unstable();
            unsafe {
                // faster than from_utf version with safety check
                return String::from_utf8_unchecked(s);
            }
        }
        let s: Vec<u8> = s.chars().map(|c| c as u8).collect::<Vec<_>>();
        let mut min = s.clone();
        let mut s2 = s.clone();
        move_back(&mut s2);
        while s2 != s {
            min = if cmp_lex(&min, &s2) != 1 {
                min
            }
            else {
                s2.clone()
            };
            move_back(&mut s2);
        }
        unsafe {
            return String::from_utf8_unchecked(min);
        }
        
    }
}

pub fn cmp_lex(w1: &Vec<u8>, w2: &Vec<u8>) -> u8 {
    let mut i = 0;
    loop {
        if i == w1.len() {
            break;
        }
        if w1[i] < w2[i] {
            return 0u8;
        }
        else if w1[i] > w2[i] {
            return 1u8;
        }
        else {
            i += 1;
        }
    }
    2u8
}

pub fn move_back(s: &mut Vec<u8>) {
    if s.len() < 2 {
        return;
    }
    let mut i = 1;
    while i < s.len() {
        s.swap(i, i-1);
        i += 1;
    }
}