// https://leetcode.com/problems/strong-password-checker/solutions/1497854/rust-solution-using-dijkstra-s-algorithm-156-ms-85-3-mb-and-bfs-18-ms-6-7-mb/
use std::collections::BinaryHeap;
use std::cmp::Reverse;

#[derive(Clone, Copy, PartialOrd, PartialEq, Eq, Ord, Debug)]
enum LastTwo {
    Empty,
    Alone(char),
    Double(char)
}
use LastTwo::*;

fn upd(lt: LastTwo, c: char) -> LastTwo {
    if lt == Alone(c) || lt == Double(c) {
        Double(c)
    } else {
        Alone(c)
    }
}

#[derive(Clone, Copy, PartialOrd, PartialEq, Eq, Ord, Debug)]
struct Info {
    cost: Reverse<usize>,
    ind: usize,
    num_chars: usize,
    lower: bool,
    upper: bool,
    digit: bool,
    last_two: LastTwo
}

impl Info {
    fn new(cost: Reverse<usize>, ind: usize, num_chars: usize, lower: bool, upper: bool, digit: bool, last_two: LastTwo) -> Info {
        Info { cost, ind, num_chars, lower, upper, digit, last_two }
    }
    
    fn calc_hash(&self) -> usize {
        let mut res = self.ind;
        res *= 21;
        res += self.num_chars;
        res *= 2;
        res += (self.lower as usize);
        res *= 2;
        res += (self.upper as usize);
        res *= 2;
        res += (self.digit as usize);
        res *= 1+2*256;
        res += match self.last_two {
            Empty => 0,
            Alone(ch) => 1+(ch as usize),
            Double(ch) => 257+(ch as usize)
        };
        res
    }
}

fn inc_rev(x: Reverse<usize>) -> Reverse<usize> {
    Reverse(x.0+1)
}

fn add_new_info(s: &mut [Option<usize>], h: &mut BinaryHeap<Info>, info: Info) {
    let hash = info.calc_hash();
    let should_insert = match s[hash] {
        None => true,
        Some(c) => info.cost.0 < c
    };
    if should_insert {
        s[hash] = Some(info.cost.0);
        h.push(info);
    }
}

fn add_char(mut s: &mut [Option<usize>], mut h: &mut BinaryHeap<Info>, info: Info, ch: char, new_cost: Reverse<usize>, new_ind: usize) -> bool {
    let new_lower = info.lower || ch.is_ascii_lowercase();
    let new_upper = info.upper || ch.is_ascii_uppercase();
    let new_digit = info.digit || ch.is_ascii_digit();
    if info.last_two != Double(ch) && info.num_chars < 20 {
        add_new_info(&mut s, &mut h, Info::new(new_cost, new_ind, info.num_chars+1, new_lower, new_upper, new_digit, upd(info.last_two, ch)));
        true
    } else { false }
}

fn change_char(mut s: &mut [Option<usize>], mut h: &mut BinaryHeap<Info>, chars: &[char], info: Info, ch: char) -> bool {
    if ch == chars[info.ind] || (info.ind+1 < chars.len() && ch == chars[info.ind+1]) {
        return false;
    }

    add_char(&mut s, &mut h, info, ch, inc_rev(info.cost), info.ind+1)
}

fn insert_char(mut s: &mut [Option<usize>], mut h: &mut BinaryHeap<Info>, chars: &[char], info: Info, ch: char) -> bool {
    if info.ind < chars.len() && ch == chars[info.ind] {
        return false;
    }
    
    add_char(&mut s, &mut h, info, ch, inc_rev(info.cost), info.ind)
}

impl Solution {
    pub fn strong_password_checker(password: String) -> i32 {
        let chars: Vec<char> = password.chars().collect();
        
        let mut min_cost: Vec<Option<usize>> = vec![None; (chars.len()+1)*21*2*2*2*(1+2*256)];
        let mut heap: BinaryHeap<Info> = BinaryHeap::new();
        
        add_new_info(&mut min_cost, &mut heap, Info::new(Reverse(0), 0, 0, false, false, false, Empty));
        
        while let Some(info) = heap.pop() {
            if let Some(c) = min_cost[info.calc_hash()] {
                if c < info.cost.0 {
                    continue;
                }
            }
            
            if info.ind == chars.len() && info.num_chars >= 6 && info.lower && info.upper && info.digit {
                return info.cost.0 as i32;
            }
            
            if info.ind < chars.len() {
                //Edge type 1 (i.e. change nothing)
                add_char(&mut min_cost, &mut heap, info, chars[info.ind], info.cost, info.ind+1);
                
                //Edge type 2 (i.e. delete character)
                add_new_info(&mut min_cost, &mut heap, Info::new(inc_rev(info.cost), info.ind+1, info.num_chars, info.lower, info.upper, info.digit, info.last_two));
                
                //Edge type 4 (i.e. replace char): lowercase
                for ch in ('a'..='z') {
                    if change_char(&mut min_cost, &mut heap, &chars, info, ch) { break; }
                }
                //Edge type 4: uppercase
                for ch in ('A'..='Z') {
                    if change_char(&mut min_cost, &mut heap, &chars, info, ch) { break; }
                }
                //Edge type 4: digit
                for ch in ('0'..='9') {
                    if change_char(&mut min_cost, &mut heap, &chars, info, ch) { break; }
                }
            }
            
            //Edge type 3 (i.e. insert char): lowercase
            for ch in ('a'..='z') {
                if insert_char(&mut min_cost, &mut heap, &chars, info, ch) { break; }
            }
            //Edge type 3: uppercase
            for ch in ('A'..='Z') {
                if insert_char(&mut min_cost, &mut heap, &chars, info, ch) { break; }
            }
            //Edge type 3: digit
            for ch in ('0'..='9') {
                if insert_char(&mut min_cost, &mut heap, &chars, info, ch) { break; }
            }
        }
        panic!("No answer found!");
    }
}