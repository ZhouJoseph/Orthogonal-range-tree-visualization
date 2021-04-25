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
  <img src="image/sampletree.png" alt="Logo" width="80" height="80">
  <h3 align="center">Orthogonal Range Tree</h3>

  <p align="center">
    <a href="https://github.com/ZhouJoseph/BOrthogonal-range-tree-visualization">View Demo</a>
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

[![Orthogonal-range-tree-visualization][tree-screenshot]](#)

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

There exists an optimized version: store the last dimension in a fractional cascading fashion rather than a tree. The later one increases time complexity for the query of the normal range tree to 
- O(log^(d-1)(n) + k)

### Implementation Difficulties


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
[tree-screenshot]: images/tree.png
