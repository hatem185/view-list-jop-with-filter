const fetchJsonDataToLocalStorage = (url) => {
  fetch(url)
    .then((response) => response.json())
    .then((json) => localStorage.setItem("data", JSON.stringify(json)));
};
// information section
const createImage = (srcImg = "") => {
  const logoImg = createElement({ tag: "img" });
  logoImg.src = srcImg;
  logoImg.alt = "logo img";
  return logoImg;
}; //
const createDesc = ({ company, newCmp, featured } = info) => {
  const companyDesc = createElement({
    tag: "div",
    classList: ["company-desc"],
  });
  companyDesc.appendChild(
    createElement({
      tag: "span",
      idName: "company_name",
      textContent: company,
    })
  );
  newCmp
    ? companyDesc.appendChild(
        createElement({
          tag: "span",
          idName: "new",
          textContent: "new!",
        })
      )
    : null;
  featured
    ? companyDesc.appendChild(
        createElement({
          tag: "span",
          idName: "featured",
          textContent: "featured",
        })
      )
    : null;
  return companyDesc;
}; //
const createAbout = ({ postedAt, contract, location } = about) => {
  const compAbout = createElement({
    tag: "div",
    classList: ["about-company"],
  });
  compAbout.appendChild(
    createElement({ tag: "span", idName: "postedAt", textContent: postedAt })
  );
  const dot = createElement({ tag: "span", classList: ["dot"] });
  compAbout.appendChild(dot);
  compAbout.appendChild(
    createElement({ tag: "span", idName: "contract", textContent: contract })
  );
  compAbout.appendChild(dot.cloneNode(true));
  compAbout.appendChild(
    createElement({ tag: "span", idName: "location", textContent: location })
  );
  return compAbout;
}; //
const createCompanyDetails = (data) => {
  const companyDetails = createElement({
    tag: "div",
    classList: ["company-details"],
  });
  const companyImg = createElement({
    tag: "div",
    classList: ["company-image"],
  });
  companyImg.appendChild(createImage(data.logo));
  companyDetails.appendChild(companyImg);
  const companyInfo = createElement({
    tag: "div",
    classList: ["company-info"],
  });
  companyInfo.appendChild(
    createDesc({
      company: data.company,
      newCmp: data.new,
      featured: data.featured,
    })
  );
  companyDetails.appendChild(companyInfo);
  const companyPosition = createElement({
    tag: "div",
    classList: ["company-position"],
  });
  companyPosition.appendChild(
    createElement({ tag: "h3", idName: "position", textContent: data.position })
  );
  companyInfo.appendChild(companyPosition);
  companyDetails.appendChild(companyInfo);
  companyInfo.appendChild(
    createAbout({
      postedAt: data.postedAt,
      contract: data.contract,
      location: data.location,
    })
  );
  return companyDetails;
}; //
//end information section
//skills and tools section
const createSkillsTools = (langsSkills = [], typeId = "") => {
  const skillsTools = createElement({ tag: "div", idName: typeId });
  langsSkills.forEach((langSkill) => {
    skillsTools.appendChild(
      createElement({
        tag: "a",
        classList: [typeId === "skills" ? "skill" : "language", "skills-tools"],
        textContent: langSkill,
      })
    );
  });
  return skillsTools;
};
const createCompanySkillsTools = ({
  role,
  level,
  languages,
  tools,
} = skillsTools) => {
  const companySkillsTools = createElement({
    tag: "div",
    classList: ["company-skills-tools"],
  });
  companySkillsTools.appendChild(
    createElement({
      tag: "span",
      idNames: "role",
      textContent: role,
      classList: ["skills-tools"],
    })
  );
  companySkillsTools.appendChild(
    createElement({
      tag: "span",
      idNames: "level",
      textContent: level,
      classList: ["skills-tools"],
    })
  );
  companySkillsTools.appendChild(createSkillsTools(languages, "languages"));
  companySkillsTools.appendChild(createSkillsTools(tools, "tools"));
  return companySkillsTools;
};
// end skills and tools section
const createCompanyCard = (e = {}) => {
  const companyCard = createElement({
    tag: "div",
    classList: ["company-card"],
    idNames: `card-${e.id}`,
  });
  e.featured ? companyCard.classList.add("featured-card") : null;
  companyCard.appendChild(createCompanyDetails(e));
  companyCard.appendChild(createCompanySkillsTools(e));
  return companyCard;
};
const createCompanyList = (data = []) => {
  $companyList.innerHTML = "";
  data.forEach((e) => {
    $companyList.appendChild(createCompanyCard(e));
  });
};
fetchJsonDataToLocalStorage("./data.json");
const dataJson = JSON.parse(localStorage.getItem("data"));
createCompanyList(dataJson);

$filterBar.innerHTML = "";
const filterData = [];
const checkFilterBar = (ele) => filterData.some((e) => ele === e);
const createFilterItem = (item) => {
  const filterItems = createElement({
    tag: "div",
    classList: ["filter-bar-item"],
  });
  const removeBtn = createElement({
    tag: "span",
    classList: ["remove-btn"],
    textContent: "X",
  });
  filterItems.append(item, removeBtn);
  return filterItems;
};
// filter the data from the local storage
const filterCompany = (data = []) => {
  const newData = data.filter((d) => {
    let keys = [];
    keys.push(d.role);
    keys.push(d.level);
    keys = keys.concat(d.languages);
    keys = keys.concat(d.tools);
    return filterData.every((fd) => keys.includes(fd));
  });
  createCompanyList(newData);
};

// skills, tools and filter event handlers
window.addEventListener("click", (e) => {
  // add items to filter bar
  if (e.target.classList.contains("skills-tools")) {
    if ($filterBar.innerHTML.trim() === "") $filterBar.classList.remove("none");
    const textCon = e.target.textContent.trim();
    if (!checkFilterBar(textCon)) {
      filterData.push(textCon);
      $filterBar.appendChild(createFilterItem(e.target.cloneNode(true)));
      filterCompany(dataJson);
    }
  }
  // remove items from filter bar
  if (e.target.classList.contains("remove-btn")) {
    const removeKey = e.target.parentElement
      .querySelector(".skills-tools")
      .textContent.trim();
    filterData.splice(filterData.indexOf(removeKey), 1);
    e.target.parentElement.remove();
    filterCompany(dataJson);
    if ($filterBar.innerHTML.trim() === "") $filterBar.classList.add("none");
  }
});
