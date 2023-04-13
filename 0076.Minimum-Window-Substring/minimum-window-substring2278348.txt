// https://leetcode.com/problems/minimum-window-substring/solutions/2278348/rust-o-n-m/
impl Solution {
	pub fn min_window(s: String, t: String) -> String {
		let mut map  = [0; 58];
		let mut n = 0 as usize;
		for c in t.chars() {
			n += 1;
			map[(c as u8 - b'A') as usize] +=1;
		}
		let mut min = 10000000 as usize;
		let mut candidate: Option<(usize,usize)>  = None;
		let char_list = s.as_bytes();
		let mut i = 0 as usize;
		let mut count = 0;
		for j in 0..char_list.len() {
			if map[(char_list[j] - b'A') as usize] > 0 {count += 1;}
			map[(char_list[j] - b'A') as usize] -= 1;
			if count >= n && min > j - i {
				min = j - i;
				candidate = Some((i,j));
			}
			while i<=j && count >= n {
				if count >= n && min > j - i {
					min = j - i;
					candidate = Some((i,j));
				}
				map[(char_list[i] - b'A') as usize] += 1;
				if map[(char_list[i] - b'A') as usize] > 0 {count -= 1;}
				i += 1;
			}
		}
		// println!("{:?}",candidate);
		match candidate {
			Some((a,b)) => s[a..b+1].to_string(),
			None => "".to_string()
		}
	}
}