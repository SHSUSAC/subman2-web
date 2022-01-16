import Link from "next/link";

export default function Index() {
	return (
		<>
			<main className="container mx-auto">
				<header className="text-center px-3 lg:px-0">
					<h1 className="my-4 text-2xl md:text-3xl lg:text-5xl font-black leading-tight">
						Scuba Management System
					</h1>
					<p className="leading-normal text-primary-dark text-base md:text-xl lg:text-2xl mb-8">Version 2</p>
				</header>

				{/*<aside className="flex items-center w-full mx-auto content-end">*/}
				{/*	<div*/}
				{/*		className={`${styles.browserMockup} flex flex-1 m-6 md:px-0 md:m-12 bg-white w-1/2 rounded shadow-xl`}*/}
				{/*	>*/}
				{/*		<Svg src={SiteLogo} />*/}
				{/*	</div>*/}
				{/*</aside>*/}

				<section className="py-8 dark:bg-darker">
					<div className="container mx-auto flex flex-wrap pt-4 pb-12">
						<h2 className="w-full my-2 text-5xl font-black leading-tight text-center dark:text-light text-gray-800">
							Module dashboards
						</h2>
						<div className="w-full mb-4">
							<div className={"h-1 mx-auto w-64 opacity-25 my-0 py-0 rounded-t"} />
						</div>

						<div className="w-full md:w-1/4 p-6 flex flex-col flex-grow flex-shrink">
							<Link href={"/equipment/dashboard"}>
								<a className="flex flex-wrap no-underline hover:no-underline">
									<div className="flex-1 bg-white dark:bg-dark rounded-t rounded-b-none overflow-hidden shadow">
										<p className="w-full dark:text-light text-gray-600 text-xs md:text-sm px-6 mt-6">
											Equipment
										</p>
										<div className="w-full font-bold text-xl dark:text-gray-400 text-gray-800 px-6">
											Gear Up
										</div>
										<p className="dark:text-light text-gray-600 text-base px-6 mb-5">
											Click here to move to the equipment module to manage club kit
										</p>
									</div>
								</a>
							</Link>
						</div>

						<div className="w-full md:w-1/4 p-6 flex flex-col flex-grow flex-shrink">
							<Link href={"/comms/dashboard"}>
								<a className="flex flex-wrap no-underline hover:no-underline">
									<div className="flex-1 bg-white dark:bg-dark rounded-t rounded-b-none overflow-hidden shadow">
										<p className="w-full dark:text-light text-gray-600 text-xs md:text-sm px-6 mt-6">
											Chat
										</p>
										<div className="w-full font-bold text-xl dark:text-gray-400 text-gray-800 px-6">
											Communication Hub
										</div>
										<p className="dark:text-light text-gray-600 text-base px-6 mb-5">
											Click here to move to the chat module to talk to others
										</p>
									</div>
								</a>
							</Link>
						</div>

						<div className="w-full md:w-1/4 p-6 flex flex-col flex-grow flex-shrink">
							<Link href={"/calender/dashboard"}>
								<a className="flex flex-wrap no-underline hover:no-underline">
									<div className="flex-1 bg-white dark:bg-dark rounded-t rounded-b-none overflow-hidden shadow">
										<p className="w-full dark:text-light text-gray-600 text-xs md:text-sm px-6 mt-6">
											Calender
										</p>
										<div className="w-full font-bold text-xl dark:text-gray-400 text-gray-800 px-6">
											Dates to remember
										</div>
										<p className="dark:text-light text-gray-600 text-base px-6 mb-5">
											Click here to move to the calender module for trip, training and more dates
											to remember
										</p>
									</div>
								</a>
							</Link>
						</div>

						<div className="w-full md:w-1/4 p-6 flex flex-col flex-grow flex-shrink">
							<Link href={"/storage/dashboard"}>
								<a className="flex flex-wrap no-underline hover:no-underline">
									<div className="flex-1 bg-white dark:bg-dark rounded-t rounded-b-none overflow-hidden shadow">
										<p className="w-full dark:text-light text-gray-600 text-xs md:text-sm px-6 mt-6">
											Storage
										</p>
										<div className="w-full font-bold text-xl dark:text-gray-400 text-gray-800 px-6">
											Share it all
										</div>
										<p className="dark:text-light text-gray-600 text-base px-6 mb-5">
											Click here to move to the storage module to upload and share files for the
											club
										</p>
									</div>
								</a>
							</Link>
						</div>

						<div className="w-full md:w-1/4 p-6 flex flex-col flex-grow flex-shrink">
							<Link href={"/system/dashboard"}>
								<a className="flex flex-wrap no-underline hover:no-underline">
									<div className="flex-1 bg-white dark:bg-dark rounded-t rounded-b-none overflow-hidden shadow">
										<p className="w-full dark:text-light text-gray-600 text-xs md:text-sm px-6 mt-6">
											System
										</p>
										<div className="w-full font-bold text-xl dark:text-gray-400 text-gray-800 px-6">
											Control it
										</div>
										<p className="dark:text-light text-gray-600 text-base px-6 mb-5">
											Click here to move to the system module to manage this software
										</p>
									</div>
								</a>
							</Link>
						</div>
					</div>
				</section>
			</main>
		</>
	);
}
