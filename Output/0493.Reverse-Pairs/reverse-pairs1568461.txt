// https://leetcode.com/problems/reverse-pairs/solutions/1568461/rust-solution-using-inversions/
    let mut parts = v.chunks(v.len() / 2 + v.len() % 2);
    let part_left = Self::merge_sort(parts.next().unwrap().to_vec(), res);
    let part_right = Self::merge_sort(parts.next().unwrap().to_vec(), res);

    let mut iter_left = part1.into_iter().peekable();
    let mut iter_right = part2.into_iter().peekable();
    
    let mut res_vec : Vec<Elem> = vec![];
    
    let mut doubled_count = 0;
    while iter_left.peek().is_some() || iter_right.peek().is_some() {
        if iter_left.peek().is_none() || (iter_right.peek().is_some() && iter_left.peek().unwrap().x > iter_right.peek().unwrap().x) {
            res_vec.push(iter_right.next().unwrap());
            if res_vec.last().unwrap().doubled {
                doubled_count += 1;
            }
        } else {
            res_vec.push(iter_left.next().unwrap());
            if !res_vec.last().unwrap().doubled {
                *res += doubled_count;
            }
        }
    }
    return res_vec;
}

pub fn reverse_pairs(nums: Vec<i32>) -> i32 {
    let mut res = 0;
    let mut v : Vec<Elem> = vec![];
    for x in nums.into_iter() {
        v.push(Elem{doubled: true, x: x as i64 * 2});            
        v.push(Elem{doubled: false, x: x as i64});
    }
    Self::merge_sort(v, &mut res);
    res
}