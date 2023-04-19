// https://leetcode.com/problems/text-justification/solutions/2376317/rust-solution-2ms-2-2mb/
impl Solution {
    pub fn full_justify(words: Vec<String>, max_width: i32) -> Vec<String> {
        let mut ret = Vec::new();

        let mut currlist = Vec::new();

        let mut currlen = 0;

        for (idx, s) in words.iter().enumerate() {
            let strlen = s.len();

            // Account for extra space. If first word, then no extra space. Otherwise, every new word adds a new space
            let new_currlen = currlen + strlen + if currlen == 0 {0} else {1};

            if new_currlen > max_width as usize {
                ret.push(Self::make_string(max_width, currlist, currlen,false));
                currlist = [s.clone()].to_vec();
                currlen = strlen;
            } else {
                currlen = new_currlen;
                currlist.push(s.clone());
            }
        }

        if currlist.len() > 0 {
            ret.push(Self::make_string(max_width, currlist, currlen, true));
        }

        return ret;

    }

    fn make_string(max_width: i32, vec: Vec<String>, total_len: usize, last:bool) -> String{
        let left_over = (max_width as usize) - total_len;
        if vec.len() == 1 {
            let mut ret = vec[0].to_owned();
            ret.push_str(" ".repeat(left_over).as_str());
            return ret;
        }

        if last {
            let mut ret = vec.join(" ");
            ret.push_str(" ".repeat(left_over).as_str());
            return ret;

        }

        let spread = left_over / (vec.len() - 1);
        let div = left_over % (vec.len() - 1);

        let mut ret = String::new();

        for (idx, s) in vec.iter().enumerate() {
            ret.push_str(s);
            if idx == vec.len() - 1 {
                continue;
            }
            let has_div = (idx + 1) <= div;
            let num_spaces = spread + 1 + if has_div {1} else {0};

            ret.push_str(" ".repeat(num_spaces).as_str());
        }
        return ret;

    }
}
