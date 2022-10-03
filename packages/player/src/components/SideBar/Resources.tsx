import AttachEmailIcon from "@mui/icons-material/AttachEmail";

function Resources(props: any) {
  const _resources: any = [...(window as any).courseData.resources];

  const resources: any = [..._resources];
  resources.sort((a: any, b: any) => a.title.localeCompare(b.title));

  return (
    <div className="SideBarResourcesPanel" style={{ display: props.active ? "block" : "none" }}>
      <header>
        <h1>Additional Resources</h1>
      </header>
      <div className="resources">
        {resources.map((resource) => {
          return (
            <div key={"id-" + resource.id} className="resource" aria-expanded="true">
              <a
                href={"./course/assets/" + resource.url}
                target="new"
                style={{ cursor: "pointer" }}
              >
                <AttachEmailIcon />

                <span>{resource.title}</span>
              </a>
              {resource.description ? (
                <div className="description">{resource.description}</div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Resources;
