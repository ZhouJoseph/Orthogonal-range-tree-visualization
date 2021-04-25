# Project Summary
Orthogonal range tree is a two dimensional range tree that enables efficient lookup of all the points within the query constraints. 

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]



<!-- PROJECT LOGO -->
<br />
<p align="center">
<!--   <img src="image/sampletree.png" alt="Logo" width="80" height="80"> -->
  <h3 align="center">Orthogonal Range Tree</h3>

  <p align="center">
    <a href="https://zhoujoseph.github.io/Orthogonal-range-tree-visualization/">View Demo</a>
    ·
    <a href="https://github.com/ZhouJoseph/Orthogonal-range-tree-visualization/issues">Report Bug</a>
  </p>
</p>



<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#about-range-tree">About Range Tree</a></li>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
  </ol>
</details>




<!-- ABOUT THE PROJECT -->
## About The Project

![Orthogonal-range-tree-visualization][coloredtree]

This is the final project deliverables for the course **CS-GY 6703: Computational Geometry** instructed by *[Prof. Boris Aronov](https://engineering.nyu.edu/faculty/boris-aronov)* at **NYU Tandon**.

It's an individual half a semester project. I haven't tried visualizing anything using pure JavaScript before. And, while I was googling around, I found plenty of KD-tree visualization projects, but haven't found any range tree visualization projects. So I thought that this could be a challenging and interesting project. 

The plan was to implement a normal 2D range tree without fractional cascading and visualize its construction as well as searching execution using just HTML, CSS and JavaScript, and host it on GitHub pages. But in the middle of the implementation, I think that there's nothing much that you can do to visualize its construction, so I focus more on delivering a understandable, step-by-step visualization for the search part.

<!-- ABOUT Range Tree -->
### About Range Tree

A brute force approach would take O(n) time to report all the points within a given range, as we need to iterate through all the points and check if that point locates in the range or not. This type of question is referred to as range quries, and range tree is built with the purpose to answer range searching queries efficiently (faster than linear).

In this project, we focus on orthogonal queries, but it can be optimized to suit other range query types.

A normal range tree partitions the data by each of its dimensions, and each node would have an additional range tree partitioned by another dimension as its associate structure.
- construction time: O(nlogn)
- space complexity: O(nlogn)
- query time complexity: O(log^d(n) + k) where d is the dimension of the data and k is the #point in range

<img src="[tree]" width="40" height="40" />

There exists an optimized version: store the last dimension in a fractional cascading fashion rather than a tree. The later one increases time complexity for the query of the normal range tree to 
- O(log^(d-1)(n) + k)

### Implementation Difficulties

#### Algorithm's Side
For a two dimensional range tree, the horizontal tree leaves are sorted by its x value from small to large, while the vertical tree is sorted by the data's y value from small to large.

The two dimensional range search algorithm can be decomposed into several smaller parts:
1. find horizontal tree's split node **S**
3. iterating split nodes' left and right, respectively
4. compare the node's value with the range
  - if we are visiting the left subtree of **S**, let's call it **L**, and if **L**'s value is less than or equal to **Xl**, then we can conclude that all x value of the nodes to the right **L** are within the range. So we can simply do a one dimensional range search on **L**'s right child, and move the pointer to the left child of **L**.
  - Otherwise we can simply visit the right child of **L**
  - Logic is reversed for the right subtree of **S**
5. one dimensional range search: similarily, first find the splite node **S**, and here if we are visiting the left subtree of **S**, let's call it **L**, and if **L**'s value is less than or equal to **Xl**, then we can conclude that all y value of the nodes to the right **L** are within the range. So we can simply report the entire right subtree of **L**. Because we already know that the points that we are visiting are within range horizontally, and now we know that this subtree is within range vertically. So all the points are definitely within range.
6. One difficulty is to deal with degeneracies and edge case handling. To do that, I built a random points and query generator, and a test function which I can specify how many times and how many points to run the test with. And fine tune the function comparison's and algorithms. The major difference I notice is that to deal with degenracy in range tree, we need to change many signs of the comparison from simply "<" or ">" to "<=" and ">="

#### Visualization's Side
In order to have an interactive design, I would want a way to connect the points in the plane canvas and the nodes in the tree canvas. So I simply assigned an id for each of the node that gets created, and use that node id as part of the element's class name

Later on, I found out that I need to treat leaf nodes and normal nodes differently, because I want to highlight all the nodes that represents the same point in the plane canvas in the tree canvas and vice versa.

However, as I feel like just color coding the execution is not very enough, I added a text explaination for each of the step that is taking place. I would like to connect these text message with its corresponding nodes as well, but that comes another problem: using one id is not enough. Because if that's the case, when a message is related to a leaf node, I would highlight all the other leaf nodes but not that specific leaf node.

I ended up using two different ids, and assign the nodes two different classnames with two id being part of the name, something like : id+"node" and leafID+"leaf". This is the only solution that came to my mind, if there's a neater solution, please let me know.

### Built With
* [D3](https://d3js.org/)
* [JQuery](https://jquery.com/)
* [BootStrap](https://getbootstrap.com/)
* [Bluma](https://bulma.io/)

<!-- GETTING STARTED -->
## Getting Started

### Installation

1. Understand range tree [wiki](https://en.wikipedia.org/wiki/Range_tree)
2. Clone the repo
   ```sh
   git clone https://github.com/ZhouJoseph/Orthogonal-range-tree-visualization.git
   ```
3. That's it. Open index.html in your browser
4. If you just want to view the project, please simply go [here](https://zhoujoseph.github.io/Orthogonal-range-tree-visualization/)

<!-- LICENSE -->
## License
Distributed under the MIT License. See `LICENSE` for more information.

<!-- CONTACT -->
## Contact

Kaixuan Zhou - LinkedIn[@kaixuan-zhou-nyu](https://www.linkedin.com/in/kaixuan-zhou-nyu/) - kaixuan.zhou@nyu.edu

Project Link: [https://github.com/ZhouJoseph/Orthogonal-range-tree-visualization](https://zhoujoseph.github.io/Orthogonal-range-tree-visualization/)

<!-- ACKNOWLEDGEMENTS -->
## Acknowledgements
* [Best-README-Template](https://github.com/othneildrew/Best-README-Template)
* [Img Shields](https://shields.io)
* [GitHub Pages](https://pages.github.com)

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/ZhouJoseph/Orthogonal-range-tree-visualization.svg?style=for-the-badge
[contributors-url]: https://github.com/ZhouJoseph/Orthogonal-range-tree-visualization/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/ZhouJoseph/Orthogonal-range-tree-visualization.svg?style=for-the-badge
[forks-url]: https://github.com/ZhouJoseph/Orthogonal-range-tree-visualization/network/members
[stars-shield]: https://img.shields.io/github/stars/ZhouJoseph/Orthogonal-range-tree-visualization.svg?style=for-the-badge
[stars-url]: https://github.com/ZhouJoseph/Orthogonal-range-tree-visualization/stargazers
[issues-shield]: https://img.shields.io/github/issues/ZhouJoseph/Orthogonal-range-tree-visualization.svg?style=for-the-badge
[issues-url]: https://github.com/ZhouJoseph/Orthogonal-range-tree-visualization/issues
[license-shield]: https://img.shields.io/github/license/ZhouJoseph/Orthogonal-range-tree-visualization.svg?style=for-the-badge
[license-url]: https://github.com/ZhouJoseph/Orthogonal-range-tree-visualization/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/kaixuan-zhou-nyu
[coloredtree]: images/coloredtree.png
[tree]: images/tree.png
[plane]: images/plane.png
