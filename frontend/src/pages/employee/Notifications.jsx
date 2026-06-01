import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { Bell, BellRing, Calendar, CalendarRange } from "lucide-react";
import {
  deleteNotification,
  getMyNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../../services/notificationServices.js";
import NotificationActions from "../../components/notifications/NotificationActions.jsx";
import EmptyNotifications from "../../components/notifications/EmptyNotifications.jsx";
import NotificationFilters from "../../components/notifications/NotificationFilters.jsx";
import NotificationList from "../../components/notifications/NotificationList.jsx";
import NotificationStats from "../../components/notifications/NotificationStats.jsx";
import { FadeIn } from "../../components/motion/FadeIn.jsx";

const TOKEN_KEY = "flexiwork_token";

const TYPE_CATEGORY = {
  REMINDER: "System",
  TASK_ASSIGNED: "Task",
  TASK_COMPLETED: "Task",
  LEAVE_APPROVED: "Leave",
  LEAVE_REJECTED: "Leave",
  MISSING_LOG: "Attendance",
  PLAN_PUBLISHED: "Shift",
  PROJECT_CREATED: "System",
};

const normalizeNotification = (item) => {
  return {
    id: item._id || item.id,
    title: item.title || "Notification",
    message: item.message || "",
    type: item.type || "REMINDER",
    read: Boolean(item.read),
    createdAt: item.createdAt || item.sentAt,
    sentAt: item.sentAt,
  };
};

const EmployeeNotifications = () => {
  const [readFilter, setReadFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const token = localStorage.getItem(TOKEN_KEY);
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notifications", { page: 1, limit: 20 }],
    queryFn: () => getMyNotifications({ page: 1, limit: 20 }, token),
    enabled: Boolean(token),
  });

  const markReadMutation = useMutation({
    mutationFn: (id) => markNotificationAsRead(id, token),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const markAllMutation = useMutation({
    mutationFn: () => markAllNotificationsAsRead(token),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteNotification(id, token),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const notifications = useMemo(() => {
    const list = data?.data || [];
    return list.map(normalizeNotification);
  }, [data]);

  const unreadCount =
    typeof data?.unreadCount === "number"
      ? data.unreadCount
      : notifications.filter((item) => !item.read).length;
  const totalCount = notifications.length;
  const readCount = notifications.filter((item) => item.read).length;

  const todayCount = notifications.filter((item) =>
    item.createdAt ? dayjs(item.createdAt).isSame(dayjs(), "day") : false
  ).length;
  const weekCount = notifications.filter((item) =>
    item.createdAt ? dayjs().diff(item.createdAt, "day") < 7 : false
  ).length;

  const stats = [
    { label: "Unread Notifications", value: unreadCount, icon: BellRing },
    { label: "Total Notifications", value: totalCount, icon: Bell },
    { label: "Today's Notifications", value: todayCount, icon: Calendar },
    { label: "This Week", value: weekCount, icon: CalendarRange },
  ];

  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      const matchesRead =
        readFilter === "ALL" ||
        (readFilter === "UNREAD" && !item.read) ||
        (readFilter === "READ" && item.read);

      const category = TYPE_CATEGORY[item.type] || "System";
      const matchesType = typeFilter === "ALL" || category === typeFilter;

      const searchText = search.trim().toLowerCase();
      const matchesSearch =
        searchText.length === 0 ||
        item.title.toLowerCase().includes(searchText) ||
        item.message.toLowerCase().includes(searchText);

      return matchesRead && matchesType && matchesSearch;
    });
  }, [notifications, readFilter, typeFilter, search]);

  const isWorking =
    markReadMutation.isPending ||
    markAllMutation.isPending ||
    deleteMutation.isPending;

  const handleClearRead = async () => {
    const readIds = notifications.filter((item) => item.read).map((item) => item.id);
    if (readIds.length === 0 || !token) return;

    await Promise.all(readIds.map((id) => deleteMutation.mutateAsync(id)));
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  };

  return (
    <section className="space-y-8">
      <FadeIn>
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Notifications</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Stay on top of approvals, reminders, and important updates.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={0.05}>
        <NotificationStats stats={stats} isLoading={isLoading} />
      </FadeIn>

      <FadeIn delay={0.08}>
        <NotificationActions
          unreadCount={unreadCount}
          readCount={readCount}
          onMarkAllRead={() => markAllMutation.mutate()}
          onClearRead={handleClearRead}
          isWorking={isWorking}
        />
      </FadeIn>

      <FadeIn delay={0.1}>
        <div className="rounded-3xl border border-border bg-card p-6 space-y-6">
          <NotificationFilters
            readFilter={readFilter}
            onReadFilterChange={setReadFilter}
            typeFilter={typeFilter}
            onTypeFilterChange={setTypeFilter}
            search={search}
            onSearchChange={setSearch}
          />

          {isLoading ? (
            <div className="rounded-2xl border border-border bg-white p-6 text-muted-foreground">
              Loading notifications...
            </div>
          ) : isError ? (
            <div className="rounded-2xl border border-border bg-white p-6 text-destructive">
              Failed to load notifications.
            </div>
          ) : filteredNotifications.length === 0 ? (
            <EmptyNotifications />
          ) : (
            <NotificationList
              notifications={filteredNotifications}
              onMarkRead={(id) => markReadMutation.mutate(id)}
              onDelete={(id) => deleteMutation.mutate(id)}
            />
          )}
        </div>
      </FadeIn>
    </section>
  );
};

export default EmployeeNotifications;
