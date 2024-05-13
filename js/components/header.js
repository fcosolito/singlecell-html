class Header extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">LifeSCS</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" 
          aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Plots
              </a>
              <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                <li><a class="dropdown-item" href="./plots/low_dimensional.html">Low Dimensional</a></li>
                <li><a class="dropdown-item" href="./plots/heatmap.html">Heatmap</a></li>
                <li><a class="dropdown-item" href="./plots/cluster_tree.html">Cluster Tree</a></li>
                <li><a class="dropdown-item" href="./plots/violin.html">Violin</a></li>
              </ul>
            </li>
          </ul>
          <a class="nav-link" aria-current="page" href="#">Log in</a>
        </div>
      </div>
    </nav>


    `;
  }
}

customElements.define('header-component', Header);
