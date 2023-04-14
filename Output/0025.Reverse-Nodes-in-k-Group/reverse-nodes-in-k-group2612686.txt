// https://leetcode.com/problems/reverse-nodes-in-k-group/solutions/2612686/unsafe-no-double-traverse-no-recursive-rust-code-with-o-1-of-space-and-o-n-of-time/
// Definition for singly-linked list.
// #[derive(PartialEq, Eq, Clone, Debug)]
// pub struct ListNode {
//   pub val: i32,
//   pub next: Option<Box<ListNode>>
// }
// 
// impl ListNode {
//   #[inline]
//   fn new(val: i32) -> Self {
//     ListNode {
//       next: None,
//       val
//     }
//   }
// }
#[inline(always)]
pub fn get_reversed_k_group(
    mut head: Option<Box<ListNode>>,
    k: i32,
) -> (Option<Box<ListNode>>, Option<Box<ListNode>>, bool) {
    // loop k times and reverse the list while looping
    // return the head of reversed list and the next node not yet reversed
    let mut prev = None;
    for _ in 0..k {
        if head.is_none() {
            // not enough nodes to reverse
            return (prev, head, false);
        }
        let next = head.as_mut().unwrap().next.take();
        head.as_mut().unwrap().next = prev;
        prev = head;
        head = next;
    }
    (prev, head, true)
}

#[inline(always)]
pub fn get_reversed_k_group_if_possible(
    mut head: Option<Box<ListNode>>,
    k: i32,
) -> (Option<Box<ListNode>>, Option<Box<ListNode>>) {
    // loop k times and reverse the list while looping
    // return the head of reversed list and the next node not yet reversed
    if k <= 1 {
        let next = head.as_mut().unwrap().next.take();
        return (head, next);
    }
    let (start_of_reversed, next, was_enough_items) = get_reversed_k_group(head, k);
    if was_enough_items {
        return (start_of_reversed, next);
    } else {
        let (start_of_reversed_back, _, _) = get_reversed_k_group(start_of_reversed, k);
        return (start_of_reversed_back, None);
    }
}





impl Solution {
	pub fn reverse_k_group(head: Option<Box<ListNode>>, k: i32) -> Option<Box<ListNode>> {
		// this will have unsafe code as we need to keep a pointer to the last node of the reversed list
		let mut head = head;
		if k <= 1 {
			return head;
		}
		if head.is_none() {
			return None;
		}
		let mut global_head = None;
		// get raw pointer to head List Node
		let mut prev_last_node_in_reversed_list: *mut ListNode = &mut **head.as_mut().unwrap();
		let mut i = 0;

		loop {
			let last_node_in_reversed_list: *mut ListNode = &mut **head.as_mut().unwrap();

			let (start_of_reversed, next) = get_reversed_k_group_if_possible(head, k);
			if global_head.is_none() {
				global_head = start_of_reversed;
			} else {
				if i >= 1 {
					unsafe {
						(*prev_last_node_in_reversed_list).next = start_of_reversed;
					}
				}
			}
			if next.is_none() {
				return global_head;
			}
			head = next;
			prev_last_node_in_reversed_list = last_node_in_reversed_list;
			i += 1
		}
	}
}